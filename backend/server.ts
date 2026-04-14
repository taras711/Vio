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
import configJson from "./config/server.json";
import { createAuthController } from "./core/auth/AuthController";
import { createLicenseRouter } from "./api/routes/license";
import { createAuthRouter } from "./api/routes/auth";
import { createUserRoutes } from "./modules/users/userRoutes";
import { UserService } from "./modules/users/UserService";
import { UserController } from "./modules/users/UserController";
import cors from "cors";


const config = configJson;

async function main() {
    const app = express();

    // CSRF TOKEN GENERATOR – MUSÍ BÝT PRVNÍ
    // ALWAYS attach CSRF token to every JSON response
// app.use((req, res, next) => {
//     const csrf = crypto.randomBytes(32).toString("hex");
//     res.setHeader("x-csrf-token", csrf);
//     next();
// });


    app.use(cookieParser());
    app.use(express.json());

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
    console.log("CONFIGURED AT START:", setup.isConfigured());

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


    // app.use((req, res, next) => {
    //     const url = req.originalUrl;

    //     if (
    //         url === "/api/auth/login" ||
    //         url === "/api/auth/refresh" ||
    //         url === "/api/auth/me"
    //     ) {
    //         return next();
    //     }

    //     const token = req.headers["x-csrf-token"];
    //     if (!token) {
    //         return res.status(403).json({ error: "Missing CSRF token" });
    //     }

    //     next();
    // });

    app.use((req, res, next) => {
        next();
    });

    // Always available
    app.get("/api/status", (req, res) => {
        res.json({ setup: setup.isConfigured() });
    });

    // -----------------------------
    //  SETUP ROUTES
    // -----------------------------
    app.use("/api/setup", (req, res, next) => {
        if (!setup.isConfigured()) {
            return createSetupRouter(setup)(req, res, next);
        }
        next();
    });

    // -----------------------------
    //  NORMAL MODE ROUTES (mounted ALWAYS)
    // -----------------------------
    const dbConfig = loadDbConfig();
    const db = await createDatabaseAdapter(dbConfig);
    const licenseService = new LicenseService();
    const auth = new JwtAuthService(db, config.security);
    const authenticate = createAuthenticateMiddleware(auth);

// AUTH ROUTER – login + refresh
app.use("/api/auth", createAuthRouter(auth));

// AUTH CONTROLLER – me, permissions, audit
// AUTH CONTROLLER – me, permissions, audit
app.use("/api/auth", (req, res, next) => {
    if (!setup.isConfigured()) return next();
    return createAuthController(db, config, licenseService)(req, res, next);
});
// USERS MODULE
app.use("/api/users", (req, res, next) => {
    if (!setup.isConfigured()) return next();

    const userService = new UserService(db, licenseService);
    const userController = new UserController(userService);

    return createUserRoutes(userController, auth)(req, res, next);
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