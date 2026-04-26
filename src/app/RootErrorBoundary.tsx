import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { errorStore } from "./errorStore";  // ← ne hook, ale getState

interface State {
  crashed: boolean;
  error: Error | null;
}

export class RootErrorBoundary extends React.Component <{ children: React.ReactNode }, State > {
  state: State = { crashed: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { crashed: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Tlačí do store — errorStore() vrací aktuální getState()
    errorStore().push({
      message: error.message,
      source: "boundary",
      severity: "fatal",
      stack: error.stack,
      componentStack: info.componentStack ?? undefined,
    });

    if (import.meta.env.DEV) {
      console.error("[RootErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (!this.state.crashed) return this.props.children;

    // RootErrorBoundary padl = GlobalErrorOverlay NEJSPÍŠ NENÍ mounted
    // Proto zobrazíme vlastní fallback
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 480, textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Aplikace selhala
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {this.state.error?.message}
          </Typography>
          <Button
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => this.setState({ crashed: false, error: null })}
          >
            Zkusit znovu
          </Button>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Box>
      </Box>
    );
  }
}