/**
 * This file contains the routes for the users module.
 * @module core/users
 * @description This file contains the routes for the users module.
 */
import { Router, Request, Response, NextFunction } from "express";
import type { AuthContext, Permission } from "../../core/auth/types";
import type { UserController } from "./UserController";
import { createAuthenticateMiddleware } from "../../api/middleware/authenticate";
import { DefaultPermissionService } from "../../core/auth/PermissionService";
import { UserService } from "./UserService";
import { audit } from "../../core/audit/auditMiddleware";
import { AuditLogService } from "../../core/audit/AuditLogService";
import { DatabaseAdapter } from "../../core/db/DatabaseAdapter";
import { LicenseService } from "../../core/license/LicenseService";

const permissions = new DefaultPermissionService(); // type assertion

/**
 * Checks if the user has the given permission and calls the next middleware if they do.
 * 
 * @param permission - The permission to check.
 * @returns A middleware function that checks if the user has the permission.
 */
function withPermission(permission: Permission) {
  // type assertion
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth as AuthContext;
    permissions.requirePermission(auth, permission);
    next();
  };
}

/**
 * Creates the routes for the users module.
 * The routes are secured with authentication and permission
 * checks.
 * The following routes are created:
 * - GET /
 * - GET /:id
 * - POST /
 * - PUT /:id
 * - DELETE /:id
 * @param controller - The user controller.
 * @param auth - The authentication service.
 * @returns The router with the created routes.
 */
export function createUserRoutes(controller: UserController, auth: any, db: DatabaseAdapter, licenseService: LicenseService) {
  const router = Router();
  const authenticate = createAuthenticateMiddleware(auth, db, licenseService);
  const usersService = new UserService(db, licenseService);
  const auditService = new AuditLogService(db);

  router.get(
    "/",
    authenticate,
    withPermission("users.manage"),
    controller.getAll
  );

  router.get(
    "/:id",
    authenticate,
    withPermission("users.manage"),
    controller.getById
  );

  router.post(
    "/",
    authenticate,
    withPermission("users.manage"),
    controller.create
  );

  router.put(
    "/:id",
    authenticate,
    withPermission("users.manage"),
    controller.update
  );

  router.delete(
    "/:id",
    authenticate,
    withPermission("users.manage"),
    controller.delete
  );

  router.post(
    "/:id/deactivate",
    authenticate,                          // ← přidej!
    audit("deactivate", "user")(auditService),
    async (req, res) => {
      try {
        await usersService.deactivateUser(Number(req.params.id));
        return res.json({ ok: true, forceLogout: true });
      } catch (err) {
        return res.status(500).json({ error: "Failed to deactivate user" });
      }
    }
  );

  router.post(
    "/:id/activate",
    authenticate,                          // ← přidej!
    audit("activate", "user")(auditService),
    async (req, res) => {
      try {
        await usersService.activateUser(Number(req.params.id));
        return res.json({ ok: true });
      } catch (err) {
        return res.status(500).json({ error: "Failed to activate user" });
      }
    }
  );


  return router;
}