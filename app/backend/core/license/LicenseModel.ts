// backend/core/license/LicenseModel.ts
import { LicenseType } from "./LicenseType";

export interface LicenseModel {
  customerId: string;
  licenseType: LicenseType;
  expiresAt: string;
  maxUsers: number;
  allowedModules: string[];
  allowedDatabases: string[];
  serverFingerprint: string;
  signature: string;
}