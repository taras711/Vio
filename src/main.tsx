// src/main.tsx
import ReactDOM from "react-dom/client";
import "./i18n";
import { App } from "./app/App";
import { ThemeProvider } from "@app/providers/ThemeProvider";
import { QueryProvider } from "@app/providers/QueryProvider";
import { ActionFeedbackProvider } from "@core/ui/hooks/ActionFeedback";
import { GlobalErrorOverlay } from "@app/GlobalErrorOverlay";
import { RootErrorBoundary } from "@app/RootErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // 5. Window-level — zachytí cokoliv přes window.onerror
  <GlobalErrorOverlay>
    <RootErrorBoundary>
      <ActionFeedbackProvider>
        <ThemeProvider>
          <QueryProvider>
            <App />
          </QueryProvider>
        </ThemeProvider>
      </ActionFeedbackProvider>
    </RootErrorBoundary>
  </GlobalErrorOverlay>
);