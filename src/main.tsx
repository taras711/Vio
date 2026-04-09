// src/main.tsx
import ReactDOM from "react-dom/client";
import "./i18n";
import { App } from "./app/App";
import { ThemeProvider } from "@app/providers/ThemeProvider";
import { QueryProvider } from "@app/providers/QueryProvider";
import { AuthProvider } from "./auth/AuthContext";
import { ActionFeedbackProvider } from "@core/ui/hooks/ActionFeedback";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ActionFeedbackProvider>
  <ThemeProvider>
    <QueryProvider>
      

      <App />

      
    </QueryProvider>
  </ThemeProvider>
  </ActionFeedbackProvider>
  </AuthProvider>
);