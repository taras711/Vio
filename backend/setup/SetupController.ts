// backend/setup/SetupController.ts
console.log("Setup router LOADED");
import { Router } from "express";
import type { SetupService } from "./SetupService";
import { createDatabaseAdapter } from "../core/db/createAdapter";
import { LicenseService } from "../core/license/LicenseService";

const licenseService = new LicenseService();

export function createSetupRouter(setup: SetupService) {
  const router = Router();
router.get("/debug", (req, res) => {
  res.json({ ok: true });
});

  // 🔥 VALIDACE LICENCE
router.post("/validate-license", (req, res) => {
  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.json({ ok: false, error: "Missing license key" });
  }

  const isValid = licenseService.isShortCodeValid(licenseKey);

  if (!isValid) {
    return res.json({ ok: false, error: "Invalid license key" });
  }

  return res.json({ ok: true });
});

  // 🔥 1) Test DB připojení
router.post("/test-db", async (req, res) => {
  try {
    const config = req.body; // ← vezmeme celý objekt

    console.log("CONFIG RECEIVED:", config);

    const adapter = await createDatabaseAdapter(config);

    // SQLite nemá SELECT 1, ale většina adapterů to zvládne
if (config.type === "sqlite") {
  await adapter.raw("PRAGMA user_version;");
} else {
  await adapter.raw("SELECT 1");
}

    res.json({ ok: true });
  } catch (err: any) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

  // 🔥 2) Hlavní setup endpoint
router.post("/", async (req, res) => {
    try {
        await setup.runSetup(req.body);

        // 🔥 TADY: zavoláme callback, který mountne normal mode
        if (typeof setup.onConfigured === "function") {
            setup.onConfigured();
        }

        res.json({ ok: true });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

  router.post("", async (req, res) => {
      try {
          await setup.runSetup(req.body);
          res.json({ ok: true });
      } catch (err: any) {
          res.status(400).json({ error: err.message });
      }
  });

  return router;
}