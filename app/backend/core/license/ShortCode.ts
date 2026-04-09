import crypto from "crypto";
import bs58 from "bs58";

export function generateShortCode(fullLicenseJson: string): string {
  // SHA-256 hash → 32 bytes
  const hash = crypto.createHash("sha256").update(fullLicenseJson).digest();

  // Base58 → krátký, čistý, bez matoucích znaků
  const base58 = bs58.encode(hash);

  // Zkrátíme na 20 znaků
  const short = base58.slice(0, 20).toUpperCase();

  // Rozsekáme do bloků po 4 znacích
  return short.match(/.{1,4}/g)!.join("-");
}