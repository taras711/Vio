/**
 * This file contains the types for the express module.
 * @module express
 */
import "express";
import type { AuthContext } from "../core/auth/types";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthContext;
      user?: {
        userId: string;
        role: string;
        areaId?: string;
        sectorId?: string;
        permissions: string[];
      };
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    csrfToken(): string;
  }
}