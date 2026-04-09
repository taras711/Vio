export type Role = "superAdmin" | "admin" | "user";

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
  permissions: Permission[];
  type: string;
  sub: string;

}