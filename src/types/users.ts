export interface Session {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  sector?: string;
  position?: string;
  personalNumber?: string;
  lastLoginAt?: string;
  failedLoginAttempts?: number;
  mfaEnabled?: boolean;
  phoneNumber?: string;
  department?: string;
  section?: string;
  workGroup?: string;
  location?: string;
}

export interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  sector?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  personalNumber?: string;
  lastLoginAt?: string;
  failedLoginAttempts?: number;
  mfaEnabled?: boolean;
  phoneNumber?: string;
  department?: string;
  section?: string;
  workGroup?: string;
  location?: string;
  lastDeactivatedAt?: number | null;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}