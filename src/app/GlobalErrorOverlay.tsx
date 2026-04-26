import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useGlobalErrorStore, errorStore } from "./errorStore";
import { NotificationPage } from "@core/ui/pages/notification/NotificationPage";
import failed from "@assets/failed.png";

export function GlobalErrorOverlay({ children }: { children: React.ReactNode }) {
  const { error, clear } = useGlobalErrorStore();
  // Mountuje window handlery — proto musí být v komponentě, ne v store
  useEffect(() => {
    const handleWindowError = (event: ErrorEvent) => {
      if (event.message?.includes("ResizeObserver loop")) return;

      errorStore().push({
        message: event.message ?? "Runtime error",
        source: "window",
        severity: "fatal",
        stack: event.error?.stack,
      });

      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message =
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason ?? "Unhandled promise rejection");

      errorStore().push({
        message,
        source: "promise",
        severity: "error",
        stack: event.reason instanceof Error ? event.reason.stack : undefined,
      });

      event.preventDefault();
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  // Pokud není error, renderuj children normálně
  if (!error) return <>{children}</>;

  // Fatal = překryje celou obrazovku
  if (error.severity === "fatal") {
    return (
        <NotificationPage message={error.message} description={`${error.source} · ${new Date(error.timestamp).toLocaleTimeString()}`}>
          <>
          <img src={failed} alt="Error" style={{ maxWidth: "250px",margin: "0px auto" }} />
          <Box sx={{ maxWidth: 480, textAlign: "center", mt: 4 }}>
            <Button variant="outlined" onClick={clear} sx={{ mr: 1 }}>
              Zavřít
            </Button>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload stránky
            </Button>
          </Box>
          </>
        </NotificationPage>
    );
  }


}