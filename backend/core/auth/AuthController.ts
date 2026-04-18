/**
 * This middleware checks if the user is authenticated before allowing them to access the endpoint.
 * If the user is not authenticated, it returns a 401 Unauthorized response.
 * If the user is authenticated, it calls the next middleware in the chain.
 * @module core/auth/AuthController
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function in the chain.
 * @returns A middleware function that checks if the user is authenticated before allowing them to access the endpoint.
 */

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
  router.get("/me",
    authenticate, // check if user is authenticated
    audit("read", "user")(auditService), // log audit

    // get user
    async (req, res) => {
      const auth = req.auth as AuthContext;
      const user = await userService.findById(auth.userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // return user
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
      // get database info
      const dbName = await db.raw("SELECT DATABASE() AS db");
      const version = await db.raw("SELECT @@version AS version");
      const tables = await db.raw("SHOW TABLES");

      // return
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