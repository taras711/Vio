// /attendee/attendee.types.ts

export interface Attendee {
  id: string;
  email: string;
  name: string;
  role: string;
  areaId?: string | null;
  sectorId?: string | null;
  permissions: string[];
  isActive?: boolean;
  position?: string | null;
  avatarUrl?: string | null;
  personalNumber?: string | null;
  lastLoginAt?: Date | null;
  failedLoginAttempts?: number | null;
  mfaEnabled?: boolean | null;
  phoneNumber?: string | null;
  department?: string | null;
  section?: string | null;
  workGroup?: string | null;
  location?: string | null;
  lastDeactivatedAt?: number | null;

}