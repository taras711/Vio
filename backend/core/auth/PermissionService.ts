// core/auth/PermissionService.ts
import type { Request, Response, NextFunction } from "express";
import type { AuthContext, Permission } from "./types";

export interface PermissionService {
  hasPermission(ctx: AuthContext, permission: Permission): boolean;
  requirePermission(ctx: AuthContext, permission: Permission): void;
  require(permission: Permission): (req: Request, res: Response, next: NextFunction) => void;
}

export class DefaultPermissionService implements PermissionService {

  hasPermission(ctx: AuthContext, permission: Permission): boolean {
    if (!ctx) return false;

    // superAdmin má vše
    if (ctx.permissions.includes("*")) return true;

    return ctx.permissions.includes(permission);
  }

  requirePermission(ctx: AuthContext, permission: Permission): void {
    if (!this.hasPermission(ctx, permission)) {
      throw new Error("Forbidden");
    }
  }

  // ⭐ NOVÉ: Express middleware API
  require(permission: Permission) {
    return (req: Request, res: Response, next: NextFunction) => {
      const ctx = req.auth as AuthContext | undefined;

      if (!ctx) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      if (!this.hasPermission(ctx, permission)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    };
  }
}