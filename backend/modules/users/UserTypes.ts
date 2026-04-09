// backend/modules/users/UserTypes.ts
import type { Role, Permission } from "../../core/auth/types";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  permissions: Permission[];
  isActive: boolean;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: Role;
  permissions: Permission[];
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  role?: Role;
  permissions?: Permission[];
  isActive?: boolean;
}