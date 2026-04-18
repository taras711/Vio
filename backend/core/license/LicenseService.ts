/**
 * @module core/license/LicenseService
 * @description This module contains the license service.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { decodeBase58ToJson } from "./licenseKey";   // ← TADY JE OPRAVA
import type { LicenseModel } from "./LicenseModel";
import { generateShortCode, canonicalize } from "./ShortCode";

export class LicenseService {
  private license: LicenseModel;

  constructor(licenseCode?: string, isSaveToFile: boolean = false) {
    if (!licenseCode) {
      // Load license from file
      const p = path.resolve(__dirname, "../../config/license.json");
      const json = fs.readFileSync(p, "utf8");
      const obj = JSON.parse(json) as LicenseModel; 
      this.verifySignature(obj); // Verify signature
      this.license = obj;
      return;
    }

    // Load license from code
    const json = decodeBase58ToJson(licenseCode); 
    const obj = JSON.parse(json) as LicenseModel;

    this.verifySignature(obj); // Verify signature
    this.license = obj;

    // Save license to file
    if (isSaveToFile) {
      const licensePath = path.resolve(__dirname, "../../config/license.json");
      fs.writeFileSync(licensePath, JSON.stringify(obj, null, 2), "utf8");
    } 
  }

  /**
   * Verify the license signature.
   * @throws If the license signature is invalid.
   * @private
   */
  private verifySignature(license: LicenseModel) {
    const { signature, ...unsigned } = license;
    const canonical = canonicalize(unsigned); // Canonicalize the license

    const publicKeyPath = path.resolve(__dirname, "../../config/license_public.pem");
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");

    // Verify the license signature
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(canonical); // Update the verifier
    verifier.end();

    // Verify the signature
    if (!verifier.verify(publicKey, signature, "base64")) {
      throw new Error("Invalid license signature");
    }
  }


  /**
   * Verify if the given short code matches the short code of the currently loaded license.
   * @param input - The short code to verify.
   * @returns true if the given short code matches the short code of the currently loaded license.
   */
  isShortCodeValid(input: string): boolean {
    const { signature, ...unsigned } = this.license;
    const canonical = canonicalize(unsigned);
    const expected = generateShortCode(canonical);
    return expected === input.toUpperCase();
  }

  /**
   * Get the currently loaded license.
   * @returns The currently loaded license.
   */
  getLicense() {
    return this.license;
  }
}