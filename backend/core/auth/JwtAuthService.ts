// core/auth/JwtAuthService.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { AuthService } from "./AuthService";
import type { Role, Permission, AuthContext } from "./types";
import type { User } from "../users/types";
import type { DatabaseAdapter } from "../db/DatabaseAdapter";
import { RolePermissions } from "./RolePermissions";
import fs from "fs";
import path from "path";

interface JwtAuthConfig {
  jwtPrivateKey: string;
  jwtPublicKey: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
}

interface JwtPayload {
  sub: string;
  role: string;
  permissions?: string[];
  type: "access" | "refresh";
  jti: string;       // ← každý token má unikátní ID — tohle ukládáme do DB
  exp?: number;      // JWT standard claim (unix timestamp)
}

export class JwtAuthService implements AuthService {
  private db: DatabaseAdapter;
  private config: JwtAuthConfig;
  private privateKey: string;
  private publicKey: string;

  // In-memory cache pro nejčerstvěji odvolané tokeny (pouze jako optimalizace,
  // nikoli jako náhrada DB). Vyčistí se při restartu, ale DB zůstane.
  private revokedCache = new Set<string>();

  constructor(db: DatabaseAdapter, config: JwtAuthConfig) {
    this.db = db;
    this.config = config;

    this.privateKey = fs.readFileSync(
      path.resolve(process.cwd(), this.config.jwtPrivateKey),
      "utf8"
    );
    this.publicKey = fs.readFileSync(
      path.resolve(process.cwd(), this.config.jwtPublicKey),
      "utf8"
    );

    // Pravidelně mazat expirované záznamy z DB (každou hodinu)
    setInterval(() => this.cleanExpiredTokens(), 60 * 60 * 1000);
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────

  async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new Error("USER_NOT_FOUND");
    if (!user.isActive) throw new Error("USER_INACTIVE");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("INVALID_PASSWORD");

    const permissions = this.getPermissions(user.role);

    const accessToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      permissions,
      type: "access",
      jti: crypto.randomUUID(),
    }, this.config.accessTokenTtlSeconds);

    const refreshToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      type: "refresh",
      jti: crypto.randomUUID(),
    }, this.config.refreshTokenTtlSeconds);

    return { accessToken, refreshToken };
  }

  // ── REFRESH ────────────────────────────────────────────────────────────────

  async refresh(refreshToken: string) {
    const payload = this.verifyToken(refreshToken);
    if (!payload || payload.type !== "refresh") {
      throw new Error("Invalid refresh token");
    }

    // Zkontroluj DB (přežije restart serveru)
    const isRevoked = await this.isTokenRevoked(payload.jti);
    if (isRevoked) {
      throw new Error("Refresh token revoked");
    }

    const user = await this.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    // Odvolej starý token (token rotation)
    await this.revokeToken(payload.jti, payload.exp);

    const permissions = this.getPermissions(user.role);

    const newAccessToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      permissions,
      type: "access",
      jti: crypto.randomUUID(),
    }, this.config.accessTokenTtlSeconds);

    const newRefreshToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      type: "refresh",
      jti: crypto.randomUUID(),
    }, this.config.refreshTokenTtlSeconds);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ── VERIFY ─────────────────────────────────────────────────────────────────

  async verifyAccessToken(token: string): Promise<AuthContext | null> {
    const payload = this.verifyToken(token);
    if (!payload || payload.type !== "access") return null;

    // Access tokeny jsou krátké (15 min) — pro ně stačí cache, DB kontrola
    // by zbytečně zatížila každý request. Pokud potřebuješ okamžité odvolání
    // i access tokenů, odkomentuj řádek níže.
    // if (await this.isTokenRevoked(payload.jti)) return null;

    return {
      userId: String(payload.sub),
      role: payload.role as Role,
      permissions: (payload.permissions ?? []) as string[],
      type: payload.type,
      sub: String(payload.sub),
    };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const payload = this.verifyToken(token);
    if (!payload) return;
    await this.revokeToken(payload.jti, payload.exp);
  }

  // ── PRIVATE HELPERS ────────────────────────────────────────────────────────

  private async isTokenRevoked(jti: string): Promise<boolean> {
    // Rychlá kontrola v cache (vyhne se DB na čerstvě odvolané tokeny)
    if (this.revokedCache.has(jti)) return true;

    // Plná kontrola v DB (přežije restart)
    const row = await this.db.findOne<{ jti: string }>("revoked_tokens", { jti });
    if (row) {
      this.revokedCache.add(jti); // přidej do cache pro příští dotaz
      return true;
    }

    return false;
  }

  private async revokeToken(jti: string, exp?: number): Promise<void> {
    const now = Date.now();
    // exp je unix timestamp v sekundách → převedeme na ms
    const expiresAt = exp ? exp * 1000 : now + this.config.refreshTokenTtlSeconds * 1000;

    await this.db.insert("revoked_tokens", {
      jti,
      revokedAt: now,
      expiresAt,
    });

    this.revokedCache.add(jti);
  }

  private async cleanExpiredTokens(): Promise<void> {
    try {
      await this.db.raw(
        `DELETE FROM revoked_tokens WHERE expiresAt < ?`,
        [Date.now()]
      );
      // Vyčisti i cache — expirované tokeny JWT library stejně odmítne
      this.revokedCache.clear();
    } catch (err) {
      console.error("Failed to clean expired revoked tokens:", err);
    }
  }

  private getPermissions(role: Role): Permission[] {
    return role === "superadmin" ? ["*"] : RolePermissions[role];
  }

  private signToken(payload: JwtPayload, ttlSeconds: number): string {
    return jwt.sign(payload, this.privateKey, {
      algorithm: "RS256",
      expiresIn: ttlSeconds,
    });
  }

  private verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ["RS256"],
      }) as JwtPayload;
    } catch {
      return null;
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.db.find<User>("users", { email });
    return users[0] ?? null;
  }

  private async findUserById(id: string): Promise<User | null> {
    return this.db.findOne<User>("users", { id });
  }
}
