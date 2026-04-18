import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "./AuthService";
import type { AuthContext } from "./types";

export function createAuthenticateMiddleware(authService: AuthService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = header.slice(7);
const auth = await authService.verifyAccessToken(token);
console.log("DEBUG AUTH TYPE:", auth);

if (!auth) {
  return res.status(401).json({ error: "Invalid token" });
}

req.auth = auth as AuthContext;

    next();
  };
}