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
  createdAt: Date;
  updatedAt: Date;
  personalNumber?: string;
  lastLoginAt?: Date;
  failedLoginAttempts?: number;
  mfaEnabled?: boolean;
  avatarUrl?: string;
  phoneNumber?: string;
  position?: string;
  department?: string;
  section?: string;
  workGroup?: string;
  location?: string;
  lastDeactivatedAt: number | null;
}