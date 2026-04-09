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
  jwtPrivateKey: string;   // cesta k souboru
  jwtPublicKey: string;    // cesta k souboru
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
}

interface JwtPayload {
  sub: string;
  role: string;
  permissions?: string[];
  type: "access" | "refresh";
  jti: string;
}

export class JwtAuthService implements AuthService {
  private db: DatabaseAdapter;
  private config: JwtAuthConfig;
  private revokedRefreshTokens = new Set<string>();
  private privateKey: string;
  private publicKey: string;

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
  }


  // ---------------- LOGIN ----------------

  async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    if (!user.isActive) {
      throw new Error("USER_INACTIVE");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new Error("INVALID_PASSWORD");
    }

    const permissions = this.getPermissions(user.role);

    const accessToken = this.signToken(
      {
        sub: String(user.id),
        role: user.role,
        permissions,
        type: "access",
        jti: crypto.randomUUID()
      },
      this.config.accessTokenTtlSeconds
    );

    const refreshToken = this.signToken(
      {
        sub: String(user.id),
        role: user.role,
        type: "refresh",
        jti: crypto.randomUUID()
      },
      this.config.refreshTokenTtlSeconds
    );

    return { accessToken, refreshToken };
  }

  // ---------------- REFRESH ----------------

  async refresh(refreshToken: string) {
    if (this.revokedRefreshTokens.has(refreshToken)) {
      throw new Error("Refresh token revoked");
    }

    const payload = this.verifyToken(refreshToken);
    if (!payload || payload.type !== "refresh") {
      throw new Error("Invalid refresh token");
    }

    const user = await this.findUserById(Number(payload.sub));
    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    // rotate refresh token
    this.revokedRefreshTokens.add(refreshToken);

    const permissions = this.getPermissions(user.role);

    const newAccessToken = this.signToken(
      {
        sub: String(user.id),
        role: user.role,
        permissions,
        type: "access",
        jti: crypto.randomUUID()
      },
      this.config.accessTokenTtlSeconds
    );

    const newRefreshToken = this.signToken(
      {
        sub: String(user.id),
        role: user.role,
        type: "refresh",
        jti: crypto.randomUUID()
      },
      this.config.refreshTokenTtlSeconds
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ---------------- VERIFY ----------------

async verifyAccessToken(token: string): Promise<AuthContext | null> {
  const payload = this.verifyToken(token);
  if (!payload || payload.type !== "access") return null;

  return {
    userId: String(payload.sub),                     // ← musí být number
    role: payload.role as Role,
    permissions: (payload.permissions ?? []) as Permission[],
    type: payload.type as "access",
    sub: String(payload.sub),
                               // ← OPTIONAL, ale užitečné
  };
}

  async revokeRefreshToken(token: string): Promise<void> {
    this.revokedRefreshTokens.add(token);
  }

  // ---------------- PRIVATE HELPERS ----------------

  private getPermissions(role: Role): Permission[] {
    return role === "superAdmin" ? ["*"] : RolePermissions[role];
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

  private async findUserById(id: number): Promise<User | null> {
    return await this.db.findOne<User>("users", { id });
  }
}