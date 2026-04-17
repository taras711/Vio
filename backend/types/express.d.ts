import "express";
import type { AuthContext } from "../core/auth/types";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    csrfToken(): string;
  }
}