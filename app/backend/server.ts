// backend/server.ts
console.log("Booting backend...");
/// <reference path="./types/express.d.ts" />

import express from "express";
import { LicenseService } from "./core/license/LicenseService";
import { createAuthenticateMiddleware } from "./api/middleware/authenticate";
import { JwtAuthService } from "./core/auth/JwtAuthService";
import { createDatabaseAdapter, DbConfig } from "./core/db/createAdapter";
import { SetupService } from "./setup/SetupService";

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

const config = configJson;

async function main() {
    const app = express();
    app.use(express.json());

    const setup = new SetupService(null);

    console.log("SERVER STARTED");
    console.log("CONFIGURED AT START:", setup.isConfigured());

    // Debug log
    app.use((req, res, next) => {
        console.log("REQ:", req.method, req.path);
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
    const db = await createDatabaseAdapter(config.database as DbConfig);
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

console.log("MOUNTING AUTH CONTROLLER? isConfigured =", setup.isConfigured());

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

    app.listen(3000, () => console.log("Server running on port 3000"));
}

main().catch(err => {
    console.error("FATAL ERROR:", err);
});