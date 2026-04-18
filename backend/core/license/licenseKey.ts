/**
 * @module license/licenseKey
 * @description This module contains functions for encoding and decoding license keys.
 */
import bs58 from "bs58";

/**
 * Encodes a base64 string into a human-readable license key.
 * The input string is first converted into a byte array using the base64 encoding.
 * Then, the byte array is encoded into a base58 string using the bs58 library.
 * Finally, the base58 string is split into groups of 5 characters each, and
 * the groups are joined together with a hyphen (-) to form the license key.
 * @param base64 - The base64 string to be encoded.
 * @returns - The human-readable license key.
 */
export function encodeHumanReadableKey(base64: string): string {
  const bytes = Buffer.from(base64, "base64");
  const encoded = bs58.encode(bytes);
  return encoded.match(/.{1,5}/g)!.join("-");
}

/**
 * Decodes a human-readable license key back into its original base64 string.
 * The input string is first cleaned of any hyphens (-) using the replace() method.
 * Then, the cleaned string is decoded into a byte array using the bs58 library.
 * Finally, the byte array is converted back into a base64 string using the toString() method.
 * @param code - The human-readable license key to be decoded.
 * @returns - The original base64 string.
 */
export function decodeHumanReadableKey(code: string): string {
  const clean = code.replace(/-/g, "");
  const bytes = bs58.decode(clean);
  return Buffer.from(bytes).toString("base64");
}

/**
 * Decodes a base58 string back into its original JSON string.
 * The input string is first cleaned of any hyphens (-) using the replace() method.
 * Then, the cleaned string is decoded into a byte array using the bs58 library.
 * Finally, the byte array is converted back into a JSON string using the toString() method.
 * @param fullBase58 - The base58 string to be decoded.
 * @returns - The original JSON string.
 */
export function decodeBase58ToJson(fullBase58: string): string {
  const clean = fullBase58.replace(/-/g, "");
  const bytes = bs58.decode(clean);
  const base64 = Buffer.from(bytes).toString("base64");   // ← TADY JE OPRAVA
  const json = Buffer.from(base64, "base64").toString("utf8");
  return json;
}