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
 * Sanitizes an object by removing sensitive information.
 * @param obj - The object to sanitize.
 * @returns A sanitized version of the object.
 * @example
 * const obj = { password: "password", foo: "bar" };
 * const sanitized = sanitize(obj); // { foo: "bar", password: "***REDACTED***" }
 */
function sanitize(obj: any) {
  if (!obj || typeof obj !== "object") return obj;

  const clone = { ...obj };

  const sensitive = [
    "password",
    "newPassword",
    "oldPassword",
    "passwordConfirmation",
    "token",
    "accessToken",
    "refreshToken",
    "mfaCode",
    "otp",
    "secret",
    "pin"
  ];

  for (const key of sensitive) {
    if (clone[key] !== undefined) {
      clone[key] = "***REDACTED***";
    }
  }

  return clone;
}

/**
 * Logs an audit log entry into the database whenever a request is made.
 * The audit log entry contains information about the request, such as the action that was performed,
 * the entity that was affected, and the id of the entity that was affected.
 * @param action - The action that was performed.
 * @param entity - The entity that was affected.
 * @param auditService - The audit log service to use for logging the audit log entry.
 * @returns A middleware function that logs an audit log entry into the database.
 */
export function audit(action: string, entity: string) {
  return (auditService: AuditLogService) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const oldJson = res.json;
      const idParam = req.params.id as string | string[] | undefined;

      const entityId =
        Array.isArray(idParam)
          ? idParam.join(",")
          : idParam ?? "";

      res.json = function (body: any) {
        auditService.log({
          userId: req.auth?.userId ?? "anonymous",
          action,
          entity,
          entityId,
          details: {
            method: req.method,
            path: req.originalUrl,
            body: sanitize(req.body), // sanitize the request body
            result: body
          }
        });

        return oldJson.call(this, body);
      };

      next();
    };
}
