// backend/setup/validate-license.ts
console.log("VALIDATE LICENSE ENDPOINT RUNNING");
import { Router } from "express";
import { LicenseService } from "../core/license/LicenseService";

const licenseService = new LicenseService();

export function createSetupRouter(setupService: any) {
  const router = Router();

  // VALIDACE LICENCE
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

  return router;
}