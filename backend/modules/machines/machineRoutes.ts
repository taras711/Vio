import { Router } from "express";
import type { MachineController } from "./MachineController";
import { createAuthenticateMiddleware } from "../../api/middleware/authenticate";
import { DefaultPermissionService } from "../../core/auth/PermissionService";
import { AuditLogService } from "../../core/audit/AuditLogService";
import { audit } from "../../core/audit/auditMiddleware";


export function createMachineRoutes(
  controller: MachineController,
  auth: any,
  auditService: AuditLogService
) {
  const router = Router();
  const permissions = new DefaultPermissionService();

  // 1) Autentizace
  router.use(createAuthenticateMiddleware(auth));

  // 2) Čtení – bez audit logu
  router.get(
    "/",
    permissions.require("machines.read"),
    controller.getAll
  );

  router.get(
    "/:id",
    permissions.require("machines.read"),
    controller.getById
  );

  // 3) Vytvoření – s audit logem
  router.post(
    "/",
    permissions.require("machines.manage"),
    audit("machines.create", "machine")(auditService),
    controller.create
  );

  // 4) Update – s audit logem
  router.put(
    "/:id",
    permissions.require("machines.manage"),
    audit("machines.update", "machine")(auditService),
    controller.update
  );

  // 5) Delete – s audit logem
  router.delete(
    "/:id",
    permissions.require("machines.manage"),
    audit("machines.delete", "machine")(auditService),
    controller.delete
  );

  return router;
}