// api/routes/auth.ts
import { Router } from "express";
import type { AuthService } from "../../core/auth/AuthService";

export function createAuthRouter(auth: AuthService) {
  const router = Router();

  router.post("/login", async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const tokens = await auth.login(email, password); // ← TADY
      return res.json(tokens);

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


  router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body ?? {};
    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refresh token" });
    }

    try {
      const tokens = await auth.refresh(refreshToken);
      res.json(tokens);
    } catch {
      res.status(401).json({ error: "Invalid refresh token" });
    }
  });

  return router;
}