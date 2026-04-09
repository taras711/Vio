// TEST: pokud tohle nevyhodí chybu, TS ten soubor nečte
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