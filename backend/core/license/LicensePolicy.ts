/**
 * Interface for the license policy.
 * @module license/LicensePolicy
 * @description This module contains the interface for the license policy.
 */
import { LicenseType } from "./LicenseType";

export interface LicensePolicy {
  durationDays: number;
  maxUsers: number;
  allowedModules: string[];
  allowedDatabases: string[];
  gracePeriodDays: number;
  blocksAppOnExpire: boolean;
}

export const LICENSE_POLICIES: Record<LicenseType, LicensePolicy> = {
  // Trial license
  trial: {
    durationDays: 14,
    maxUsers: 3,
    allowedModules: ["users"],
    allowedDatabases: ["sqlite"],
    gracePeriodDays: 0,
    blocksAppOnExpire: true
  },
  // Standard license
  standard: {
    durationDays: 365,
    maxUsers: 50,
    allowedModules: ["users", "machines"],
    allowedDatabases: ["postgres", "mysql"],
    gracePeriodDays: 0,
    blocksAppOnExpire: false
  },
  // Enterprise license
  enterprise: {
    durationDays: 365 * 3,
    maxUsers: 9999,
    allowedModules: ["*"],
    allowedDatabases: ["*"],
    gracePeriodDays: 14,
    blocksAppOnExpire: false
  }
};