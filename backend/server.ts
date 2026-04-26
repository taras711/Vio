/**
 * @module server
 * @description This module contains the server code.
 */
/// <reference path="./types/express.d.ts" />

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import timeout from "connect-timeout";
import csurf from "csurf";
import fs from "fs";
import path from "path";
import { LicenseService } from "./core/license/LicenseService";
import { createAuthenticateMiddleware } from "./api/middleware/authenticate";
import { JwtAuthService } from "./core/auth/JwtAuthService";
import {loadDbConfig} from "./core/db/config/Database";
import { createDatabaseAdapter } from "./core/db/createAdapter";
import { SetupService } from "./setup/SetupService";
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

function loadServerConfig() {
  const configPath = path.resolve(__dirname, "./config/server.json");
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf8"));
}

async function main() {
    const app = express();

//------------ SECURITY
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
            frameguard: { action: "deny" }, // Pre clickjackingu
            hsts: true, // HTTP Strict Transport Security
            referrerPolicy: { policy: "no-referrer" },
        })
    );

    app.use(cookieParser());
    app.use(express.json());

    // Timeout for requests
    app.use(timeout("30s")); // TODO: Add for production with shorter timeout (10-15s) and proper error handling
    
    // CORS
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

//------------ CSRF
    const setup = new SetupService(null);

// ------------ Content Security Policy
    app.use((req, res, next) => {
        res.setHeader(
            "Content-Security-Policy",
            "default-src 'self' http://localhost:5173; connect-src 'self' http://localhost:5173 http://localhost:3000; img-src 'self' data:; style-src 'self' 'unsafe-inline';"
        );
        next();
    });

// ------------ SETUP
    // Always available
    // ALWAYS: status + setup
    app.get("/api/status", async (req, res) => {
        const isConfigured = setup.isConfigured();
        let dbOk = false; // Default db is not ok

        // Check DB
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

    let db: any = null; // Database
    let auth: JwtAuthService | null = null; // Auth service


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
    const authenticate = createAuthenticateMiddleware(auth, db, licenseService);

    

// LOGIN + REFRESH (bez CSRF)
app.use("/api/auth", createAuthRouter(auth));

// CSRF PROTECTION – musí být až po login/refresh
app.use(csurf({
  cookie: {
    key: "_csrfSecret",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  }
}));

// POSÍLÁME CSRF TOKEN DO HLAVIČKY KAŽDÉ ODPOVĚDI
app.use((req, res, next) => {
  try {
    res.setHeader("x-csrf-token", req.csrfToken());
  } catch (_) {
    // GET/HEAD/OPTIONS nemají csrfToken → ignorujeme
  }
  next();
});

// OSTATNÍ AUTH ROUTY (chráněné CSRF)
app.use("/api/auth", (req, res, next) => {
  if (!setup.isConfigured()) return next();
  return createAuthController(db, config, licenseService)(req, res, next);
});


    app.use("/api/users", (req, res, next) => {
      if (!setup.isConfigured()) return next();
      const userService = new UserService(db, licenseService);
      const userController = new UserController(userService);
      return createUserRoutes(userController, auth!, db, licenseService)(req, res, next);
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

    // Přidat na konec server.ts — MUSÍ být za všemi routami
// a mít 4 parametry (Express ho pozná jako error middleware)

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = (err as any).status ?? (err as any).statusCode ?? 500;

  // Strukturované logování — v produkci sem přijde Pino/Winston
  const log = {
    level: status >= 500 ? "error" : "warn",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // stack jen v dev
    path: req.path,
    method: req.method,
    userId: req.auth?.userId,
    timestamp: new Date().toISOString(),
  };

  if (status >= 500) {
    console.error(JSON.stringify(log));
  } else {
    console.warn(JSON.stringify(log));
  }

  // Nikdy neposílat stack trace do produkce
  res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Uncaught synchronní výjimky — zabrání pádu celého procesu
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
  // Graceful shutdown — dej time na dokončení in-flight requestů
  setTimeout(() => process.exit(1), 1000);
});

// Neošetřené promise rejecty
process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection]", reason);
  // Neukončuj proces — pouze loguj, pokud nejde o kritickou chybu
});

    app.listen(3000, () => console.log("Server listening: http://localhost:3000"));
}

main().catch(err => {
    console.error("FATAL ERROR:", err);
});