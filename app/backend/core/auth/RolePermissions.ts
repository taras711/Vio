import type { Role, Permission } from "./types";

export const RolePermissions: Record<Role, Permission[]> = {
  superAdmin: ["*"],

  admin: [
    "machines.read",
    "machines.write",
    "machines.delete",
    "machines.view",
    "machines.manage",
    "users.manage",
    "config.edit"
  ],

  user: [
    "machines.read",
    "machines.view"
  ]
};