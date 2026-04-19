/**
 * @module api/routes/auth
 * @description This file contains the routes for the authentication module.
 */
import { Router } from "express";
import type { AuthService } from "../../core/auth/AuthService";
import { createGlobalRateLimit, loginRateLimit, refreshRateLimit } from "../../core/middleware/rateLimit";

/**
 * Creates a router for the authentication module.
 * The router contains two endpoints: POST /api/auth/login and POST /api/auth/refresh.
 * The login endpoint logs in a user with their email and password, and returns an access token and a refresh token.
 * The refresh endpoint refreshes an access token and a refresh token.
 * Both endpoints are protected with rate limiting.
 * @param auth - The authentication service.
 * @returns - The router for the authentication module.
 */
export function createAuthRouter(auth: AuthService) {
  const router = Router();

//------------------------------------------------------- POST /api/auth/login
  router.post("/login", loginRateLimit, async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const { accessToken, refreshToken } = await auth.login(email, password);

      // refresh token → httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,       // in production true
        sameSite: "lax",
        path: "/api/auth/refresh"
      });

      // access token → httpOnly cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,       // in production true
        sameSite: "lax",
        path: "/"
      });

      // return ok response
      return res.json({ ok: true });

    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      // handle errors
      if (err.message === "USER_NOT_FOUND" || err.message === "INVALID_PASSWORD") {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (err.message === "USER_INACTIVE") {
        return res.status(403).json({ error: "User is inactive" });
      }

      return res.status(500).json({ error: "Internal server error. Please try again later" });
    }
  });

//------------------------------------------------------- POST /api/auth/refresh
  router.post("/refresh", refreshRateLimit, async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token" });
    }

    try {
      const { accessToken, refreshToken: newRefresh } = await auth.refresh(refreshToken);

      // Update refresh token cookie in English
      res.cookie("refreshToken", newRefresh, {
        httpOnly: true,
        secure: false,       // in production true
        sameSite: "lax",
        path: "/api/auth/refresh"
      });

      // Update access token cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,       // in production true
        sameSite: "lax",
        path: "/"
      });

      return res.json({ ok: true }); // return ok response

    } catch {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  });

  return router;
}
