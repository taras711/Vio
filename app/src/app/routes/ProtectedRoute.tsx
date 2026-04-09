// src/app/routes/ProtectedRoute.tsx
import { useAuth } from "../../auth/AuthContext";
import { useEffect } from "react";
import { useNavigate, useMatches, Outlet } from "react-router-dom";
import { Loading } from "@core/ui/primitives/Loading";
import type { RouteHandle } from "./types";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const matches = useMatches();
  const path = window.location.pathname;

  // Najdeme metadata aktuální route
  const meta = matches
    .map(m => m.handle as RouteHandle | undefined)
    .find(h => h?.meta)?.meta;

  // 1) Redirect na login pokud není user
  useEffect(() => {
    if (!loading && !user && !path.startsWith("/setup")) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, path, navigate]);
console.log("MATCHES:", matches);
console.log("META:", meta);
console.log("USER:", user);

  // 2) Setup wizard je vždy povolený
  if (path.startsWith("/setup")) {
    return children;
  }

  // 3) Počkej na auth
  if (loading) {
    return <Loading />;
  }

  // 4) Pokud není user → redirect proběhne v useEffect
  if (!user) {
    return null;
  }

  // 5) Permission guard
  if (meta?.permission) {
    const hasPermission =
      user.permissions.includes("*") ||
      user.permissions.includes(meta.permission);

    if (!hasPermission) {
      return <div style={{ padding: 20 }}>Access denied</div>;
    }
  }


  // 6) Renderuj stránku
  return children ? children : <Outlet />;
}