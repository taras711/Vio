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
  const { error } = useActionFeedback();

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(json => {
        setSetup(json.setup);
        setLoading(false);
      })
      .catch(err => {
        if (err instanceof SyntaxError && err.message.includes("Unexpected end of JSON input")) {
          error("Failed to connect to server");
        } else if (err.response && err.response.status === 502) {
          error("Failed to connect to server");
        } else {
          error(err.message);
        }
        setFailed(true);
        console.error(failed);
       });
  }, []);

 
 if (failed) return <NotificationPage message="Failed to connect to server." description="It is not possible to establish a connection. Please try again later"><img style={{marginTop: "40px"}} src={NoConnection} alt="bug" /></NotificationPage>;// ← DŮLEŽITÉ</NotificationPage>;
 if (loading) return <Loading />;
  return (
    <AuthProvider>
      <UIProvider>
        <RouterProvider router={router} />
      </UIProvider>
    </AuthProvider>
  );
}