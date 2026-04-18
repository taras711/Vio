// backend/core/auth/AuthController.ts
import { Router } from "express";
import type { DatabaseAdapter } from "../db/DatabaseAdapter";
import type { LicenseService } from "../license/LicenseService";
import { JwtAuthService } from "./JwtAuthService";
import { createAuthenticateMiddleware } from "../../api/middleware/authenticate";
import { UserService } from "../../modules/users/UserService";
import type { AuthContext } from "./types";
import { audit } from "../audit/auditMiddleware";
import { AuditLogService } from "../audit/AuditLogService";
export function createAuthController(
  db: DatabaseAdapter,
  config: any,
  licenseService: LicenseService
) {
  const router = Router();

  const auditService = new AuditLogService(db);

  const authService = new JwtAuthService(db, config.security);
  const userService = new UserService(db, licenseService);
  const authenticate = createAuthenticateMiddleware(authService);

  // -------------------------------------------------------
  // GET /api/auth/me
  // -------------------------------------------------------
router.get(
  "/me",
  authenticate, // MUSÍ BÝT PRVNÍ
  audit("read", "user")(auditService),
  async (req, res) => {
    const auth = req.auth as AuthContext;
    const user = await userService.findById(auth.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: auth.permissions,
      isActive: user.isActive
    });
  }
);

  // -------------------------------------------------------
  // DEBUG ENDPOINT (volitelné)
  // -------------------------------------------------------
  router.get("/debug/db", async (req, res) => {
    try {
      const dbName = await db.raw("SELECT DATABASE() AS db");
      const version = await db.raw("SELECT @@version AS version");
      const tables = await db.raw("SHOW TABLES");

      res.json({
        connectedTo: dbName,
        mysqlVersion: version,
        tables
      });
    } catch (err: any) {
      console.error("DB DEBUG ERROR:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  return router;
}