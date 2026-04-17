// src/main.tsx
import ReactDOM from "react-dom/client";
import "./i18n";
import { App } from "./app/App";
import { ThemeProvider } from "@app/providers/ThemeProvider";
import { QueryProvider } from "@app/providers/QueryProvider";
import { ActionFeedbackProvider } from "@core/ui/hooks/ActionFeedback";
import { ErrorBoundary } from "@app/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(

    <ActionFeedbackProvider>
  <ThemeProvider>
    <QueryProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryProvider>
  </ThemeProvider>
  </ActionFeedbackProvider>
);