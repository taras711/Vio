import type { Attendee } from "@src/services/attendee/attendee.types";

export interface User {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  fullName: string;
  avatar?: string;
  sectorId?: string;
  areaId?: string;
}
export function mapAttendeeToUser(a: Attendee): User {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    fullName: a.name,          // alias
    position: a.position ?? "",
    department: a.department ?? "",
    avatarUrl: a.avatarUrl ?? "",
    sectorId: a.sectorId ?? "",
    areaId: a.areaId ?? "",
  };
}
