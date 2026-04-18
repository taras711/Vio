/**
 * Checks if a user has a given permission.
 * @module core/auth/PermissionService
 * @param ctx - The user's authentication context.
 * @param permission - The permission to check.
 * @returns True if the user has the permission, false otherwise.
 */

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

    // superadmin can do anything
    if (ctx.permissions.includes("*")) return true;

    return ctx.permissions.includes(permission);
  }

  /**
   * Throws an error if the user does not have the given permission.
   * @param ctx - The user's authentication context.
   * @param permission - The permission to check.
   * @throws {Error} - If the user does not have the permission.
   */
  requirePermission(ctx: AuthContext, permission: Permission): void {
    if (!this.hasPermission(ctx, permission)) {
      throw new Error("Forbidden");
    }
  }

  // Express middleware API
  require(permission: Permission) {
    return (req: Request, res: Response, next: NextFunction) => {
      const ctx = req.auth as AuthContext | undefined; // type assertion

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