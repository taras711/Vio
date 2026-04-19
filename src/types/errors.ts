export type ErrorSeverity = "fatal" | "error" | "warning";
export type ErrorSource =
  | "window"           // window.onerror
  | "promise"          // unhandledrejection
  | "boundary"         // React ErrorBoundary
  | "async"            // useAsyncSafe hook
  | "route";           // Router errorElement

export interface GlobalError {
  id: string;
  message: string;
  source: ErrorSource;
  severity: ErrorSeverity;
  timestamp: number;
  stack?: string;
  componentStack?: string;
}