/**
 * @module core/users/types
 * @description This module contains the types for the users module.
 */
import type { Role, Permission } from "../auth/types";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  permissions: string[];
  isActive: boolean;
}