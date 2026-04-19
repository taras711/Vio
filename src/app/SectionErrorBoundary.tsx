import React from "react";
import { Alert, Button } from "@mui/material";
import { errorStore } from "./errorStore";

interface Props {
  children: React.ReactNode;
  label?: string;
}

export class SectionErrorBoundary extends React.Component <Props, { crashed: boolean } > {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    errorStore().push({
      message: `[${this.props.label ?? "Sekce"}] ${error.message}`,
      source: "boundary",
      severity: "error",       // ← ne fatal, UI pokračuje
      stack: error.stack,
      componentStack: info.componentStack ?? undefined,
    });
  }

  render() {
    if (!this.state.crashed) return this.props.children;

    return (
      <Alert
        severity="error"
        action={
          <Button size="small" onClick={() => this.setState({ crashed: false })}>
            Zkusit znovu
          </Button>
        }
      >
        {this.props.label ?? "Sekce"} — chyba renderu
      </Alert>
    );
  }
}