// api/routes/auth.ts
import { Router } from "express";
import type { AuthService } from "../../core/auth/AuthService";
import crypto from "crypto";
export function createAuthRouter(auth: AuthService) {
  const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { accessToken, refreshToken } = await auth.login(email, password);

    // 1) Vytvořit CSRF token
    const csrfToken = crypto.randomBytes(32).toString("hex");

    // 2) Uložit CSRF token do cookie (FE ho musí přečíst)
    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: false,       // v produkci true
      sameSite: "strict",
      path: "/"
    });

    // 3) Uložit refresh token do HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,       // v produkci true
      sameSite: "strict",
      path: "/api/auth/refresh"
    });

    // 4) Vrátit access token + csrf token
    return res.json({
      accessToken,
      csrfToken
    });

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
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    const { accessToken, refreshToken: newRefresh } = await auth.refresh(refreshToken);

    // obnovit refresh cookie
    res.cookie("csrf_token", newRefresh, {
      httpOnly: true,
      secure: false,       // v produkci true
      sameSite: "strict",
      path: "/api/auth/refresh"
    });

    return res.json({ accessToken });

  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});


  return router;
}