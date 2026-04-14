// api/middleware/authenticate.ts
import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "../../core/auth/AuthService";
import type { Role, Permission } from "../../core/auth/types";
import type { AuthContext } from "../../core/auth/types";

export function createAuthenticateMiddleware(auth: AuthService) {
  return async function authenticate(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = header.slice("Bearer ".length).trim();
    const ctx = await auth.verifyAccessToken(token);

    if (!ctx) {
      return res.status(401).json({ error: "Invalid token" });
    }

req.auth = {
  userId: ctx.userId,
  role: toRole(ctx.role),
  permissions: ctx.permissions,
  type: ctx.type,
  sub: ctx.sub
} as AuthContext;


    next();
  };
}

function toRole(value: string): Role {
  if (value === "admin" || value === "user" || value === "superadmin") {
    return value;
  }
  throw new Error("Invalid role in token");
}
