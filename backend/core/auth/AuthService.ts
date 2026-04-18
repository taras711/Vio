/**
 * Checks if the given token is revoked or not.
 * @module core/auth/AuthService
 * @param token - The token to check.
 * @returns A promise that resolves to true if the token is revoked or false otherwise.
 */

import type { AuthContext } from "./types";

export interface AuthService {
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  verifyAccessToken(token: string): Promise<AuthContext | null>;
  revokeRefreshToken(token: string): Promise<void>;
}