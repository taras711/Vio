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
      const p = path.resolve(__dirname, "../../config/license.json");
      const json = fs.readFileSync(p, "utf8");
      const obj = JSON.parse(json) as LicenseModel;

      this.verifySignature(obj);
      this.license = obj;
      return;
    }

    // Načítáme z Base58 kódu
    const json = decodeBase58ToJson(licenseCode);   // ← TADY JE OPRAVA
    const obj = JSON.parse(json) as LicenseModel;

    this.verifySignature(obj);
    this.license = obj;

    if (isSaveToFile) {
      const licensePath = path.resolve(__dirname, "../../config/license.json");
      fs.writeFileSync(licensePath, JSON.stringify(obj, null, 2), "utf8");
      console.log("License saved to:", licensePath);
    }
  }

private verifySignature(license: LicenseModel) {
  const { signature, ...unsigned } = license;
  const canonical = canonicalize(unsigned); // ← použij stejnou funkci jako při podpisu

  const publicKeyPath = path.resolve(__dirname, "../../config/license_public.pem");
  const publicKey = fs.readFileSync(publicKeyPath, "utf8");

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(canonical);
  verifier.end();

  if (!verifier.verify(publicKey, signature, "base64")) {
    throw new Error("Invalid license signature");
  }
}


  isShortCodeValid(input: string): boolean {
    const { signature, ...unsigned } = this.license;
    const canonical = canonicalize(unsigned);
    const expected = generateShortCode(canonical);
    return expected === input.toUpperCase();
  }


  getLicense() {
    return this.license;
  }
}