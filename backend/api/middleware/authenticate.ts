// api/middleware/authenticate.ts
import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "../../core/auth/AuthService";
import type { Role, Permission } from "../../core/auth/types";
import type { AuthContext } from "../../core/auth/types";
import { UserService } from "../../modules/users/UserService";


export function createAuthenticateMiddleware(auth: AuthService, db: any, licenseService: any) {
  return async function authenticate(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = req.cookies?.accessToken;
    const ctx = await auth.verifyAccessToken(token);

    if (!ctx) {
      return res.status(401).json({ error: "Invalid token" });
    }
    
    const userService = new UserService(db, licenseService);

    const user = await userService.getById(ctx.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

req.auth = {
  userId: ctx.userId,
  role: toRole(user.role),
  permissions: user.permissions || [],
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
