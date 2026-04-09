// backend/modules/users/userRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import type { AuthContext, Permission } from "../../core/auth/types";
import type { UserController } from "./UserController";
import { createAuthenticateMiddleware } from "../../api/middleware/authenticate";
import { DefaultPermissionService } from "../../core/auth/PermissionService";
import type { PermissionService } from "../../core/auth/PermissionService";
  const permissions = new DefaultPermissionService();

  //router.use(createAuthenticateMiddleware(auth));

function withPermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth as AuthContext;
    permissions.requirePermission(auth, permission);
    next();
  };
}
export function createUserRoutes(controller: UserController, auth: any) {
  const router = Router();
  const authenticate = createAuthenticateMiddleware(auth);

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

  return router;
}