// api/middleware/authenticate.ts
import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "../../core/auth/AuthService";
import type { Role, Permission } from "../../core/auth/types";
import type { AuthContext } from "../../core/auth/types";
import { UserService } from "../../modules/users/UserService";


export function createAuthenticateMiddleware(auth: AuthService, db: any, licenseService: any) {
  return async function authenticate(req: Request, res: Response, next: NextFunction) {
    // 1) token pouze z cookie
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: "Missing token" });
    }

    // 2) ověřit token
    const ctx = await auth.verifyAccessToken(token);

    if (!ctx) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 3) načíst uživatele
    const userService = new UserService(db, licenseService);
    const user = await userService.getById(ctx.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 4) naplnit req.auth
    req.auth = {
      userId: ctx.userId,
      role: toRole(user.role),
      permissions: user.permissions || [],
      type: ctx.type,
      sub: ctx.sub,
      areaId: user.areaId,
      sectorId: user.sectorId
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
