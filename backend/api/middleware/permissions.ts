// backend/api/middleware/permissions.ts
import type { Request, Response, NextFunction } from "express";
import type { PermissionKey } from "../../../shared/permissions";
import { PermissionResolver } from "../../core/auth/PermissionResolver";

export function requirePermission(...perms: PermissionKey[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth;
    if (!auth) return res.status(401).json({ error: "Not authenticated" });

    const resolved = new Set<string>(auth.permissions ?? []);

    const missingPerm = perms.find(p => !PermissionResolver.can(resolved, p));
    if (missingPerm) {
      return res.status(403).json({
        error: "Forbidden",
        missing: missingPerm,
      });
    }

    next();
  };
}

// Varianta: ANY z uvedených (OR místo AND)
export function requireAnyPermission(...perms: PermissionKey[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth;
    if (!auth) return res.status(401).json({ error: "Not authenticated" });

    const resolved = new Set<string>(auth.permissions ?? []);
    const hasAny = perms.some(p => PermissionResolver.can(resolved, p));

    if (!hasAny) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}