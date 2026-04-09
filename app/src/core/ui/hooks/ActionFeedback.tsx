// src/core/ui/hooks/ActionFeedback.tsx
import React, { createContext, useContext } from "react";
import { SnackbarProvider, useSnackbar } from "notistack"; //npm i notistack

interface ActionFeedbackContextValue {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
}

const ActionFeedbackContext = createContext<ActionFeedbackContextValue | null>(null);

function ActionFeedbackProviderInner({ children }: { children: React.ReactNode }) {
  const { enqueueSnackbar } = useSnackbar();

  const api = {
    success: (msg: string) => enqueueSnackbar(msg, { variant: "success" }),
    error: (msg: string) => enqueueSnackbar(msg, { variant: "error" }),
    info: (msg: string) => enqueueSnackbar(msg, { variant: "info" }),
    warning: (msg: string) => enqueueSnackbar(msg, { variant: "warning" }),
  };

  return (
    <ActionFeedbackContext.Provider value={api}>
      {children}
    </ActionFeedbackContext.Provider>
  );
}

export function ActionFeedbackProvider({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider maxSnack={3}>
      <ActionFeedbackProviderInner>{children}</ActionFeedbackProviderInner>
    </SnackbarProvider>
  );
}

export function useActionFeedback() {
  const ctx = useContext(ActionFeedbackContext);
  if (!ctx) throw new Error("useActionFeedback must be used inside <ActionFeedbackProvider>");
  return ctx;
}