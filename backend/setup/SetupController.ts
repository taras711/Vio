/**
 * @module setup/SetupController
 * @description This module contains the controller for the setup module.
 */

import { Router } from "express";
import type { SetupService } from "./SetupService";
import { createDatabaseAdapter } from "../core/db/createAdapter";
import { LicenseService } from "../core/license/LicenseService";

const licenseService = new LicenseService();

export function createSetupRouter(setup: SetupService) {
  const router = Router();

  // Debug
  router.get("/debug", (req, res) => {
    res.json({ ok: true });
  });

  // Validate license
  router.post("/validate-license", (req, res) => {
    const { licenseKey } = req.body;

    // Validate license
    if (!licenseKey) {
      return res.json({ ok: false, error: "Missing license key" });
    }

    const isValid = licenseService.isShortCodeValid(licenseKey); // Verify license key

    // Return result
    if (!isValid) {
      return res.json({ ok: false, error: "Invalid license key" });
    }

    return res.json({ ok: true });
  });

  // Test database
  router.post("/test-db", async (req, res) => {
    try {
      const config = req.body; // Get config

      const adapter = await createDatabaseAdapter(config); // Create database adapter

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

    // Basic setup endpoint
  router.post("/", async (req, res) => {
      try {
          await setup.runSetup(req.body);

          // Call onConfigured hook
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