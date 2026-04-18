/**
 * @module core/auth/RolePermissions
 * @description This file contains the permissions for each role.
 */
import type { Role, Permission } from "./types";

export const RolePermissions: Record<Role, Permission[]> = {
  superadmin: ["*"],

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