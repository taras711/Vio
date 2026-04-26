import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { UIProvider } from "@layout/ui-store";
import { useActionFeedback } from "@hooks/ActionFeedback";
import { NotificationPage } from "@pages/notification/NotificationPage";
import NoConnection from "@assets/no-connection.png";

import { SetupWizard } from "@features/setup/SetupWizard"; // ← DŮLEŽITÉ
import "../App.css";

import { AuthProvider } from "../auth/AuthContext";
import { Loading } from "@core/ui/primitives/Loading";
import { PermissionProvider } from "@src/auth/PermissionContext";

export function App() {
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [dbOk, setDbOk] = useState<boolean | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

useEffect(() => {
  let cancelled = false;

  async function checkStatus() {
    setReconnecting(true);
    try {
      const res = await fetch("/api/status").finally(() => {
        setTimeout(() => setReconnecting(false), 3000);
      });;
      const json = await res.json();

      if (cancelled) return;

      setFailed(!json.server);
      setSetup(json.setup);
      setDbOk(json.db);
      setLoading(false);
    } catch {
      if (!cancelled) setFailed(true);
    }
  }

  // 🔥 1) Okamžitý první request
  checkStatus();

  // 🔥 2) Interval pro další requesty
  const interval = setInterval(checkStatus, 10000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}, []);

 
  if (failed) {
    return (
      <NotificationPage
        message="Failed to connect to server."
        description="Trying to reconnect…"
      >
        <div className="av-logo">
          <img src={NoConnection} style={{ marginTop: 40 }} />
          {reconnecting && <div className="av-load"></div>}
        </div>
      </NotificationPage>
    );
  }
  if (loading) return <Loading />;

  if (dbOk === false && setup === true) {
    return (
      <NotificationPage
        message="Database connection failed"
        description="The server is running, but the database is not available."
      >
        <div className="av-logo">
          <img src={NoConnection} style={{ marginTop: 40 }} />
            {reconnecting && <div className="av-load"></div>}
          </div>
      </NotificationPage>
    );
  }
if (setup === false) {
  return (
    <UIProvider>
      <SetupWizard />
    </UIProvider>
  );
}
  return (
    <AuthProvider>
      <PermissionProvider>
        <UIProvider>
          <RouterProvider router={router} />
        </UIProvider>
      </PermissionProvider>
    </AuthProvider>
  );
}