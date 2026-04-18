/**
 * This file is used to test if the types are working
 * @module global
 */
type __TS_TEST__ = "HELLO_FROM_GLOBAL_DTS";
declare namespace Express {
  interface Request {
    auth?: {
      userId: string;
      role: string;
      permissions: string[];
    };
  }
}