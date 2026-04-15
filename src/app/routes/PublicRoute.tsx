// src/app/routes/PublicRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  // pokud je uživatel přihlášený → nesmí na login ani setup
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
