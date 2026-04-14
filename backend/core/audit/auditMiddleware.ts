// core/audit/auditMiddleware.ts
import type { Request, Response, NextFunction } from "express";
import type { AuditLogService } from "./AuditLogService";

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
            body: req.body,
            result: body
          }
        });

        return oldJson.call(this, body);
      };

      next();
    };
}
