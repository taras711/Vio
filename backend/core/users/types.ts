// core/users/types.ts
import type { Role, Permission } from "../auth/types";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
}