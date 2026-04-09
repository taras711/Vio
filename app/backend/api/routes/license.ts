import { Router } from "express";
import { LicenseService } from "../../core/license/LicenseService";
import { generateShortCode } from "../../core/license/ShortCode";

export function createLicenseRouter(licenseService: LicenseService) {
  const router = Router();

  router.get("/info", (req, res) => {
    const license = licenseService.getLicense();
    const json = JSON.stringify(license);
    const shortCode = generateShortCode(json);

    const status = () => {
        const exp = new Date(license.expiresAt).getTime();
        const now = new Date().getTime();
        if (now > exp) return "Expired";
        return "Active";
    }

    res.json({
      type: license.licenseType,
      expiresAt: license.expiresAt,
      maxUsers: license.maxUsers,
      allowedModules: license.allowedModules,
      allowedDatabases: license.allowedDatabases,
      shortCode,
      status: status(),
      customerId: license.customerId
    });
  });

  return router;
}