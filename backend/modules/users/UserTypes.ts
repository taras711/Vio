/**
 * @module modules/users/UserTypes
 * @description This module contains the types for the users module.
 */
import type { Role } from "../../core/auth/types";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
  permissions: string[];
  isActive: boolean;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: Role;
  permissions: string[];
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  role?: Role;
  permissions?: string[];
  isActive?: boolean;
}