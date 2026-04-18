/**
 * @module core/license/ShortCode
 * @description This module contains functions for generating a short code from a license JSON.
 */
import crypto from "crypto";
import bs58 from "bs58";

/**
 * Generates a short code from a license JSON.
 * The short code is a 20-byte base58 encoded string of the SHA-256 hash of the license JSON.
 * The string is then split into groups of 4 and joined with a hyphen (-) to form the final short code.
 * @param fullLicenseJson - The license JSON to generate a short code from.
 * @returns The generated short code.
 */
export function generateShortCode(fullLicenseJson: string): string {
  // SHA-256 hash → 32 bytes
  const hash = crypto.createHash("sha256").update(fullLicenseJson).digest();

  // Base58 → short code
  const base58 = bs58.encode(hash);

  // First 20 bytes
  const short = base58.slice(0, 20).toUpperCase();

  // Split into groups of 4
  return short.match(/.{1,4}/g)!.join("-");
}

/**
 * Canonicalizes a given object by sorting its keys and
 * recursively canonicalizing its values.
 * This function is used to normalize the input for the
 * generateShortCode function, which generates a short code from
 * a license JSON.
 * @param obj - The object to canonicalize.
 * @returns A string representing the canonicalized object.
 */
export function canonicalize(obj: any): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj); // base case

  // recursive case
  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalize).join(",") + "]";
  }

  const keys = Object.keys(obj).sort(); // sort keys
  const entries = keys.map(k => `${JSON.stringify(k)}:${canonicalize(obj[k])}`); // canonicalize values
  return "{" + entries.join(",") + "}";
}