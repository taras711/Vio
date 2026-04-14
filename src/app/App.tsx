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

export function App() {
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [dbOk, setDbOk] = useState<boolean | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

useEffect(() => {
  const interval = setInterval(() => {
    setReconnecting(true);

    fetch("/api/status")
      .then(res => res.json())
      .then(json => {
        if (json.server) {
          setFailed(false);
          setSetup(json.setup);
          setDbOk(json.db);
          setLoading(false);
        } else {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true))
      .finally(() => {
        setTimeout(() => setReconnecting(false), 3000);
      });

  }, 10000);

  return () => clearInterval(interval);
}, []); // ← TADY! ŽÁDNÉ DEPENDENCIES



 
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

  if (dbOk === false) {
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
  return <SetupWizard />;
}
  return (
    <AuthProvider>
      <UIProvider>
        <RouterProvider router={router} />
      </UIProvider>
    </AuthProvider>
  );
}