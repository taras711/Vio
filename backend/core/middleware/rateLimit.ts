/**
 * @module core/middleware/rateLimit
 * @description This module contains the rate limit middleware.
 */
import rateLimit from "express-rate-limit";

/**
 * Creates a rate limit middleware for global requests.
 * The rate limit middleware limits the number of requests to the specified maximum
 * within the specified window of time.
 * If the limit is exceeded, the middleware returns a 429 response with a JSON object
 * containing an error message.
 * @param windowMs - The time window in milliseconds.
 * @param max - The maximum number of requests within the window.
 * @returns - The rate limit middleware.
 */
export function createGlobalRateLimit(windowMs: number, max: number) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: "Too many requests" }
  });
}

export const loginRateLimit = rateLimit({
  windowMs: 60_000, // 1 minuta
  max: 5,           // 5 pokusů za minutu z jedné IP
  message: { ok: false, error: "Too many login attempts" },
  standardHeaders: true,
  legacyHeaders: false
});

export const refreshRateLimit = rateLimit({
  windowMs: 60_000,
  max: 30,
  message: { ok: false, error: "Too many refresh attempts" },
  standardHeaders: true,
  legacyHeaders: false
});
