import type { Request, Response, NextFunction } from "express";
import type { Permission } from "../../core/auth/types";

export function requirePermission(permission: Permission) {
  return function (req: Request, res: Response, next: NextFunction) {
    const auth = req.auth;

    if (!auth) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (auth.role === "superadmin") {
      return next();
    }

    if (!auth.permissions.includes(permission) && !auth.permissions.includes("*")) {
      return res.status(403).json({ error: "Forbidden", missing: permission });
    }

    next();
  };
}