// src/core/ui/pages/management/ManagenmentCategories.tsx
import type { ManagementCategory } from "@src/types/management";
export const MANAGEMENT_CATEGORIES: ManagementCategory[] = [
  {
    icon: "users",
    id: "users",
    label: "Users",
    children: [
      { icon: "administration", id: "administration", label: "Administration" },
      { icon: "profile", id: "profiles", label: "Profile Packages" },
      { icon: "role", id: "change-role", label: "Change Role" },
      { icon: "groups", id: "groups", label: "Groups" },
      { icon: "permissions", id: "change-permissions", label: "Change Permissions" },
      { icon: "security", id: "lock", label: "Security" }
    ]
  },
  {
    icon: "plugins",
    id: "plugins",
    label: "Plugins"
  },
  {
    icon: "system",
    id: "system",
    label: "System",
    children: [
      { icon: "matrix", id: "permissions-matrix", label: "Permissions Matrix" },
      { icon: "roles", id: "role-management", label: "Role Management" },
      { icon: "audit", id: "audit", label: "Audit Log" },
      { icon: "license", id: "license-manager", label: "License Manager" },
      { icon: "api", id: "api-keys", label: "API Keys" }
    ]
  },
  {
    icon: "machines",
    id: "machines",
    label: "Machines",
    children: [
      { icon: "management", id: "administration", label: "Administration" },
      { icon: "maintenance", id: "maintenance", label: "Maintenance" }
    ]
  },
  {
    icon: "domain",
    id: "domain",
    label: "Domain",
    children: [
      { icon: "sectors", id: "sectors", label: "Units" },
      { icon: "integration", id: "integration", label: "Integration" }
    ]
  }
];