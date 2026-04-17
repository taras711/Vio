// api/routes/auth.ts
import { Router } from "express";
import type { AuthService } from "../../core/auth/AuthService";

export function createAuthRouter(auth: AuthService) {
  const router = Router();

  // POST /api/auth/login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const { accessToken, refreshToken } = await auth.login(email, password);

      // refresh token → httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,       // v produkci true
        sameSite: "strict",
        path: "/api/auth/refresh"
      });

      // access token → taky httpOnly cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,       // v produkci true
        sameSite: "strict",
        path: "/"
      });

      // csurf se řeší jinde, tady už nic neposíláme
      return res.json({ ok: true });

    } catch (err: any) {
      console.error("LOGIN ERROR:", err);

      if (err.message === "USER_NOT_FOUND" || err.message === "INVALID_PASSWORD") {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (err.message === "USER_INACTIVE") {
        return res.status(403).json({ error: "User is inactive" });
      }

      return res.status(500).json({ error: "Internal server error. Please try again later" });
    }
  });

  // POST /api/auth/refresh
  router.post("/refresh", async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token" });
    }

    try {
      const { accessToken, refreshToken: newRefresh } = await auth.refresh(refreshToken);

      // obnovit refresh cookie
      res.cookie("refreshToken", newRefresh, {
        httpOnly: true,
        secure: false,       // v produkci true
        sameSite: "strict",
        path: "/api/auth/refresh"
      });

      // obnovit access token cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/"
      });

      return res.json({ ok: true });

    } catch {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
  });

  return router;
}
