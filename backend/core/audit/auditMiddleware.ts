/**
 * This middleware logs an audit log entry into the database whenever a request is made.
 * The audit log entry contains information about the request, such as the action that was performed,
 * the entity that was affected, and the id of the entity that was affected.
 * @module core/audit/auditMiddleware
 * @param req - The request object.
 * @param res - The response object.
 * @param action - The action that was performed.
 * @param entity - The entity that was affected.
 * @param auditService - The audit log service to use for logging the audit log entry.
 * @returns A middleware function that logs an audit log entry into the database.
 */

import type { Request, Response, NextFunction } from "express";
import type { AuditLogService } from "./AuditLogService";

/**
 * Logs an audit log entry into the database whenever a request is made.
 * The audit log entry contains information about the request, such as the action that was performed,
 * the entity that was affected, and the id of the entity that was affected.
 *
 * @param string action - The action that was performed.
 * @param string entity - The entity that was affected.
 * @param auditService - The audit log service to use for logging the audit log entry.
 * @returns function - A middleware function that logs an audit log entry into the database.
 */
export function audit(action: string, entity: string) {
  return (auditService: AuditLogService) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const oldJson = res.json; // Save the original json function
      const idParam = req.params.id as string | string[] | undefined;

      // Get the id of the entity that was affected
      const entityId =
        Array.isArray(idParam)
          ? idParam.join(",")
          : idParam ?? "";

      // Override the json function
      res.json = function (body: any) {
        auditService.log({
          userId: req.auth?.userId ?? "anonymous",
          action,
          entity,
          entityId,
          details: {
            method: req.method,
            path: req.originalUrl,
            body: req.body,
            result: body
          }
        });

        return oldJson.call(this, body); // Call the original json function
      };

      next(); // Call the next middleware
    };
}
