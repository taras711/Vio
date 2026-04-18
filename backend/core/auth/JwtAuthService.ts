/**
 * Login user with email and password.
 * Throws an error if the user is not found, inactive, or with an invalid password.
 * Returns an access token and a refresh token if the user is found and active.
 * The access token and refresh token are signed with the private key.
 * The access token has a ttl of config.accessTokenTtlSeconds seconds.
 * The refresh token has a ttl of config.refreshTokenTtlSeconds seconds.
 * @module core/auth/JwtAuthService
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns { accessToken: string, refreshToken: string } - The access token and refresh token.
 */

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
import { TABLES } from "../db/schema/tables";

// Config
interface JwtAuthConfig {
  jwtPrivateKey: string;
  jwtPublicKey: string;
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
}

// Payload
interface JwtPayload {
  sub: string;
  role: string;
  permissions?: string[];
  type: "access" | "refresh";
  jti: string;       // JWT standard claim
  exp?: number;
}

export class JwtAuthService implements AuthService {
  private db: DatabaseAdapter;
  private config: JwtAuthConfig;
  private privateKey: string;
  private publicKey: string;

  // In-memory cache for revoked tokens
  // Cleared on server restart.
  private revokedCache = new Set<string>();
  private revokedAccessCache = new Set<string>(); // jti access tokens

  constructor(db: DatabaseAdapter, config: JwtAuthConfig) {
    this.db = db;
    this.config = config;

    // Load private and public keys
    this.privateKey = fs.readFileSync(
      path.resolve(process.cwd(), this.config.jwtPrivateKey),
      "utf8"
    );

    // Load private and public keys
    this.publicKey = fs.readFileSync(
      path.resolve(process.cwd(), this.config.jwtPublicKey),
      "utf8"
    );

    // Clear expired records from the DB (periodic cleanup)
    setInterval(() => this.cleanExpiredTokens(), 60 * 60 * 1000);
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────

  /**
   * Logs in a user and returns an access token and a refresh token.
   * Throws an error if the user is not found, inactive, or with an invalid password.
   * The access token and refresh token are signed with the private key.
   * The access token has a ttl of config.accessTokenTtlSeconds seconds.
   * The refresh token has a ttl of config.refreshTokenTtlSeconds seconds.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns  - The access token and refresh token.
   */
  async login(email: string, password: string) {
    const user = await this.findUserByEmail(email);

    if (!user) throw new Error("USER_NOT_FOUND");
    if (!user.isActive) throw new Error("USER_INACTIVE");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("INVALID_PASSWORD");

    const permissions = this.getPermissions(user.role);

    // Clear revoked tokens cache
    const accessToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      permissions,
      type: "access",
      jti: crypto.randomUUID(),
    }, this.config.accessTokenTtlSeconds);

    // Clear revoked tokens cache (refresh token rotation)
    const refreshToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      type: "refresh",
      jti: crypto.randomUUID(),
    }, this.config.refreshTokenTtlSeconds);

    return { accessToken, refreshToken };
  }

  // ── REFRESH ────────────────────────────────────────────────────────────────

  /**
   * Refreshes an access token using a refresh token.
   *
   * @param refreshToken - The refresh token to use for refreshing the access token.
   * @throws {Error} - If the refresh token is invalid, revoked, or the user is not found or inactive.
   * @returns - A promise that resolves to an object containing the new access token and refresh token.
   */
  async refresh(refreshToken: string) {
    const payload = this.verifyToken(refreshToken); // Verify refresh token

    // Check if the token is a refresh token
    if (!payload || payload.type !== "refresh") {
      throw new Error("Invalid refresh token");
    }

    // Verify if the refresh token is revoked
    const isRevoked = await this.isTokenRevoked(payload.jti);
    if (isRevoked) {
      throw new Error("Refresh token revoked");
    }

    // Check if the user exists
    const user = await this.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    // Clear revoked tokens cache
    await this.revokeToken(payload.jti, payload.exp);

    const permissions = this.getPermissions(user.role); // Get user permissions

    // Generate new tokens
    const newAccessToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      permissions,
      type: "access",
      jti: crypto.randomUUID(),
    }, this.config.accessTokenTtlSeconds);

    // Generate new refresh token
    const newRefreshToken = this.signToken({
      sub: String(user.id),
      role: user.role,
      type: "refresh",
      jti: crypto.randomUUID(),
    }, this.config.refreshTokenTtlSeconds);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ── VERIFY ─────────────────────────────────────────────────────────────────

  /**
   * Verifies an access token and returns the user information if the token is valid.
   * Returns null if the token is invalid, revoked, or not an access token.
   * @param token - The access token to verify.
   * @returns A promise that resolves to the user information if the token is valid, or null otherwise.
   */
  async verifyAccessToken(token: string): Promise<AuthContext | null> {
    const payload = this.verifyToken(token); // Verify access token

    // Check if the token is an access token
    if (!payload || payload.type !== "access") return null;

    // Verify if the access token is revoked
    if (payload.jti && this.revokedAccessCache.has(payload.jti)) {
      return null;
    }
    // Verify if the access token is revoked
    return {
      userId: String(payload.sub),
      role: payload.role as Role,
      permissions: (payload.permissions ?? []) as string[],
      type: payload.type,
      sub: String(payload.sub),
    };
  }
  
  /**
   * Revokes a refresh token and adds it to the revoked tokens cache.
   * This will prevent the token from being used again.
   * If the token is already revoked, this does nothing.
   * @param token - The refresh token to revoke.
   * @returns A promise that resolves when the token is revoked.
   */
  async revokeRefreshToken(token: string): Promise<void> {
    const payload = this.verifyToken(token);
    if (!payload) return;
    await this.revokeToken(payload.jti, payload.exp); // Verify refresh token
  }

  /**
   * Revokes an access token and adds it to the revoked access tokens cache.
   * This will prevent the token from being used again.
   * If the token is already revoked, this does nothing.
   * @param jti - The JWT ID of the access token to revoke.
   */
  revokeAccessToken(jti: string) {
    this.revokedAccessCache.add(jti); // Add to cache for next request
  }

  // ── PRIVATE HELPERS ────────────────────────────────────────────────────────

  /**
   * Checks if a token is revoked or not.
   * First, checks in the in-memory cache. If the token is found in the cache, it returns true.
   * If the token is not found in the cache, it checks in the database. If the token is found in the database, it returns true.
   * If the token is not found in the database, it returns false.
   * @param jti - The JWT ID of the token to check.
   * @returns A promise that resolves to true if the token is revoked or false otherwise.
   */
  private async isTokenRevoked(jti: string): Promise<boolean> {
    // Fast cache
    if (this.revokedCache.has(jti)) return true;

    // Full control check
    const row = await this.db.findOne<{ jti: string }>(TABLES.revoked_tokens, { jti });
    if (row) {
      this.revokedCache.add(jti); // Add to cache for next request
      return true;
    }

    return false;
  }

  /**
   * Revokes a token and adds it to the revoked tokens cache.
   * This will prevent the token from being used again.
   * If the token is already revoked, this does nothing.
   * @param jti - The JWT ID of the token to revoke.
   * @param exp - The expiration time of the token in seconds.
   *   If not provided, the token will expire after the refresh token TTL.
   */
  private async revokeToken(jti: string, exp?: number): Promise<void> {
    const now = Date.now();
    // convert to ms
    const expiresAt = exp ? exp * 1000 : now + this.config.refreshTokenTtlSeconds * 1000;

    // Add to DB
    await this.db.insert(TABLES.revoked_tokens, {
      jti,
      revokedAt: now,
      expiresAt,
    });

    this.revokedCache.add(jti); // Add to cache for next request
  }

  /**
   * Cleans expired revoked tokens from the database and cache.
   * This is called periodically to keep the database and cache clean.
   * @returns A promise that resolves when the cleaning is done.
   */
  private async cleanExpiredTokens(): Promise<void> {
    try {
      await this.db.raw(
        `DELETE FROM ${TABLES.revoked_tokens} WHERE expiresAt < ?`,
        [Date.now()]
      );
      // Clear cache
      this.revokedCache.clear();
    } catch (err) {
      console.error("Failed to clean expired revoked tokens:", err);
    }
  }

  /**
   * Gets the permissions for a given role.
   * @param role - The role to get the permissions for.
   * @returns The permissions for the given role.
   * @example
   * const permissions = getPermissions("admin");
   * // permissions is ["machines.read", "machines.write", ...]
   */
  private getPermissions(role: Role): Permission[] {
    return role === "superadmin" ? ["*"] : RolePermissions[role]; // Get user permissions
  }

  /**
   * Signs a JWT token with the given payload and ttl.
   * @param payload - The payload to sign.
   * @param ttlSeconds - The ttl of the token in seconds.
   * @returns A signed JWT token.
   */
  private signToken(payload: JwtPayload, ttlSeconds: number): string {
    return jwt.sign(payload, this.privateKey, {
      algorithm: "RS256",
      expiresIn: ttlSeconds,
    });
  }

  /**
   * Verifies a JWT token with the given public key.
   * @param token - The JWT token to verify.
   * @returns The verified payload if the token is valid, or null if it is not.
   */
  private verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.publicKey, {
        algorithms: ["RS256"],
      }) as JwtPayload;
    } catch {
      return null;
    }
  }

  /**
   * Finds a user by email.
   * Returns the user if found, or null if not found.
   * @param email - The email of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  private async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.db.find<User>(TABLES.users, { email });
    return users[0] ?? null;
  }

  /**
   * Finds a user by id.
   * Returns the user if found, or null if not found.
   * @param id - The id of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  private async findUserById(id: string): Promise<User | null> {
    return this.db.findOne<User>(TABLES.users, { id });
  }
}
