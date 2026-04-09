// core/auth/AuthService.ts
import type { AuthContext } from "./types";

export interface AuthService {
  login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }>;
  refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }>;
  verifyAccessToken(token: string): Promise<AuthContext | null>;
  revokeRefreshToken(token: string): Promise<void>;
}