import bs58 from "bs58";

export function encodeHumanReadableKey(base64: string): string {
  const bytes = Buffer.from(base64, "base64");
  const encoded = bs58.encode(bytes);
  return encoded.match(/.{1,5}/g)!.join("-");
}

export function decodeHumanReadableKey(code: string): string {
  const clean = code.replace(/-/g, "");
  const bytes = bs58.decode(clean);
  return Buffer.from(bytes).toString("base64");
}

export function decodeBase58ToJson(fullBase58: string): string {
  const clean = fullBase58.replace(/-/g, "");
  const bytes = bs58.decode(clean);
  const base64 = Buffer.from(bytes).toString("base64");   // ← TADY JE OPRAVA
  const json = Buffer.from(base64, "base64").toString("utf8");
  return json;
}