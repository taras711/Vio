// Nullable guards — helper pro bezpečný přístup k datům
// src/utils/safe.ts

/** Bezpečné firstChar — žádný crash na null/undefined */
export const firstChar = (s?: string | null) => s?.charAt(0)?.toUpperCase() ?? "?";

/** Bezpečný array — zabrání ".map is not a function" */
export const safeArray = <T>(v: T[] | null | undefined): T[] => Array.isArray(v) ? v : [];

/** Bezpečný string */
export const safeStr = (v: unknown): string =>
  typeof v === "string" ? v : String(v ?? "");