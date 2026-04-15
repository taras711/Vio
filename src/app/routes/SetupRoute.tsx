import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
export function SetupRoute({ children }: { children: React.ReactNode }) {
  const [setup, setSetup] = useState(null);

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(json => setSetup(json.setup));
  }, []);

  if (setup === null) return null;

  if (setup === true) {
    return <Navigate to="/" replace />;
  }

  return children;
}
