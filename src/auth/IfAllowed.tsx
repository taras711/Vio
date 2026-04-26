// src/auth/IfAllowed.tsx
import { usePermission } from "./PermissionContext";
import type { PermissionKey } from "../../shared/permissions";

interface Props {
  perm?: PermissionKey | string;
  anyOf?: string[];
  allOf?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function IfAllowed({ perm, anyOf, allOf, fallback = null, children }: Props) {
  const { can, canAny, canAll } = usePermission();

  const allowed =
    (perm    && can(perm))    ||
    (anyOf   && canAny(...anyOf)) ||
    (allOf   && canAll(...allOf));

  return allowed ? <>{children}</> : <>{fallback}</>;
}