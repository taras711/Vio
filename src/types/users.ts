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
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}