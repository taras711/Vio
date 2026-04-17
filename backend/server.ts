// backend/server.ts
console.log("Booting backend...");
/// <reference path="./types/express.d.ts" />

import express from "express";
import { LicenseService } from "./core/license/LicenseService";
import { createAuthenticateMiddleware } from "./api/middleware/authenticate";
import { JwtAuthService } from "./core/auth/JwtAuthService";
import {loadDbConfig} from "./core/db/config/Database";
import { createDatabaseAdapter } from "./core/db/createAdapter";
import { SetupService } from "./setup/SetupService";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import { createSetupRouter } from "./setup/SetupController";
import { createUserModule } from "./modules/users";
import { ModuleLoader } from "./core/modules/ModuleLoader";
import { createMachinesModule } from "./modules/machines";
import { createAuthController } from "./core/auth/AuthController";
import { createLicenseRouter } from "./api/routes/license";
import { createAuthRouter } from "./api/routes/auth";
import { createUserRoutes } from "./modules/users/userRoutes";
import { UserService } from "./modules/users/UserService";
import { UserController } from "./modules/users/UserController";
import cors from "cors";
import helmet from "helmet";
import timeout from "connect-timeout";



import fs from "fs";
import path from "path";

function loadServerConfig() {
  const configPath = path.resolve(__dirname, "./config/server.json");
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}
const config = loadServerConfig();

async function main() {
    const app = express();

    app.use(
        helmet({
            contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'", "http://localhost:3000"],
                imgSrc: ["'self'", "data:"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
            },
            frameguard: { action: "deny" }, // zabrání clickjackingu
            hsts: true, // HTTP Strict Transport Security
            referrerPolicy: { policy: "no-referrer" },
        })
        );
    // CSRF TOKEN GENERATOR – MUSÍ BÝT PRVNÍ
    // ALWAYS attach CSRF token to every JSON response
// app.use((req, res, next) => {
//     const csrf = crypto.randomBytes(32).toString("hex");
//     res.setHeader("x-csrf-token", csrf);
//     next();
// });


    app.use(cookieParser());
    app.use(express.json());

    app.use(timeout("30s")); // TODO: Add for production with shorter timeout (10-15s) and proper error handling

    app.use(cors({
        origin: [
            "https://app.vio.com",
            "http://localhost:5173"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
        exposedHeaders: ["x-csrf-token"]
    }));

    const setup = new SetupService(null);

    console.log("SERVER STARTED");

    function csrfMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        const url = req.originalUrl;

        // výjimky – bez CSRF kontroly
        if (
            url === "/api/auth/login" ||
            url === "/api/auth/refresh" ||
            url === "/api/auth/me" ||
            url === "/api/status"||
            url === "/api/setup" ||
            url === "/api/setup/validate-license" ||
            url === "/api/setup/test-db"
        ) {
            return next();
        }

        const csrfCookie = req.cookies?.csrfToken;
        const csrfHeader = req.headers["x-csrf-token"];

        if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
            return res.status(403).json({ error: "Invalid CSRF token" });
        }

        next();
    }

    app.use(csrfMiddleware);

    app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' http://localhost:5173; connect-src 'self' http://localhost:5173 http://localhost:3000; img-src 'self' data:; style-src 'self' 'unsafe-inline';"
  );
  next();
});


    // Always available
    // ALWAYS: status + setup
    app.get("/api/status", async (req, res) => {
        const isConfigured = setup.isConfigured();
        let dbOk = false;

        if (isConfigured) {
            try {
            const dbConfig = loadDbConfig();
            const db = await createDatabaseAdapter(dbConfig);
            await db.ping();
            dbOk = true;
            } catch {
            dbOk = false;
            }
        }

        res.json({
            server: true,
            setup: isConfigured,
            db: dbOk
        });
    });

    app.use("/api/setup", (req, res, next) => {
        if (!setup.isConfigured()) {
            return createSetupRouter(setup)(req, res, next);
        }
        next();
    });

    let db: any = null;
    let auth: JwtAuthService | null = null;


    // -----------------------------
    //  NORMAL MODE ROUTES (mounted ALWAYS)
    // -----------------------------

try {
  const dbConfig = loadDbConfig();
  db = await createDatabaseAdapter(dbConfig);

  const config = loadServerConfig();
  if (!config) {
    console.warn("No server.json config, running without normal routes.");
  } else {
    const licenseService = new LicenseService();
    auth = new JwtAuthService(db, config.security);
    const authenticate = createAuthenticateMiddleware(auth);

    

    app.use("/api/auth", (req, res, next) => {
      if (!setup.isConfigured()) return next();
      return createAuthController(db, config, licenseService)(req, res, next);
    });

    app.use("/api/auth", createAuthRouter(auth));

    app.use("/api/users", (req, res, next) => {
      if (!setup.isConfigured()) return next();
      const userService = new UserService(db, licenseService);
      const userController = new UserController(userService);
      return createUserRoutes(userController, auth!)(req, res, next);
    });

     // LICENSE
    app.use("/api/license", (req, res, next) => {
        if (!setup.isConfigured()) return next();
        return createLicenseRouter(licenseService)(req, res, next);
    });

    // MODULES
    const allModules = [
        { name: "users", factory: createUserModule },
        { name: "machines", factory: createMachinesModule }
    ];

    const loader = new ModuleLoader(licenseService);
    const modules = loader.loadModules(
        allModules.filter(m => licenseService.getLicense().allowedModules.includes(m.name)),
        { db, license: licenseService, auth }
    );

    for (const mod of modules) {
        app.use(`/${mod.name}`, (req, res, next) => {
            if (!setup.isConfigured()) return next();
            return authenticate(req, res, () => mod.routes(req, res, next));
        });
    }
  }
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error("DB init failed, running in degraded mode:", err.message);
  } else {
    console.error("DB init failed, running in degraded mode:", err);
  }
}

   

    // -----------------------------
    //  FALLBACK
    // -----------------------------
    app.use((req, res) => {
        if (!setup.isConfigured()) {
            return res.status(503).json({
                error: "setup_required",
                message: "Application is not configured yet."
            });
        }

        res.status(404).json({ error: "not_found" });
    });

    app.listen(3000, () => console.log("Server listening: http://localhost:3000"));
}

main().catch(err => {
    console.error("FATAL ERROR:", err);
});