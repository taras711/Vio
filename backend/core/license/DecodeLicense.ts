// backend/core/license/DecodeLicense.ts
import bs58 from "bs58";

export function decodeBase58ToJson(fullBase58: string): string {
  const clean = fullBase58.replace(/-/g, "");
  const bytes = bs58.decode(clean);
  const base64 = Buffer.from(bytes).toString("utf8");
  const json = Buffer.from(base64, "base64").toString("utf8");
  return json;
}