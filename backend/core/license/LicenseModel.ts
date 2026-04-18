/**
 * Interface for the license model.
 * @module license/LicenseModel
 * @description This module contains the interface for the license model.
 */
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