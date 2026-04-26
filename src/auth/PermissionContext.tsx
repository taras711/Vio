// src/auth/PermissionContext.tsx
import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import type { PermissionKey } from "../../shared/permissions";

interface PermissionContextValue {
  can: (permission: PermissionKey | string, ctx?: Record<string, string>) => boolean;
  canAll: (...permissions: string[]) => boolean;
  canAny: (...permissions: string[]) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const value = useMemo<PermissionContextValue>(() => {
    const resolved = new Set<string>(user?.permissions ?? []);

    const can = (permission: string) => {
      return resolved.has("*") || resolved.has(permission);
    };

    return {
      can,
      canAll: (...perms) => perms.every(can),
      canAny: (...perms) => perms.some(can),
    };
  }, [user?.permissions]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error("usePermission must be used inside <PermissionProvider>");
  return ctx;
}