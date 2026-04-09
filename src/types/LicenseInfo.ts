export interface LicenseInfo {
  type: string;
  expiresAt: string;
  maxUsers: number;
  allowedModules: string[];
  allowedDatabases: string[];
  shortCode: string;
  status: string;
  customerId: string;
}