/**
 * @module core/auth/types
 * @description This file contains the types for the authentication module.
 */
export type Role = "superadmin" | "admin" | "user";

export type Permission =
    | "*"
    | "machines.read"
    | "machines.write"
    | "machines.delete"
    | "machines.create"
    | "machines.view"
    | "machines.manage"
    | "users.manage"
    | "config.edit"
    | "system.backup";

export interface AuthContext {
  userId: string;
  role: Role;
  permissions: string[];
  type: string;
  sub: string;

}