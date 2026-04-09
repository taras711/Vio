// backend/core/license/LicenseActivationService.ts
import { FULL_LICENSE_CODE } from "./StaticLicense";
import { verifyShortLicenseCode } from "./ShortCode";

export class LicenseActivationService {
  static verifyUserCode(inputCode: string): boolean {
    return verifyShortLicenseCode(FULL_LICENSE_CODE, inputCode);
  }
}