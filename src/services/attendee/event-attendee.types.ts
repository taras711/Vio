// /attendee/event-attendee.types.ts

export type EventAttendeeStatus =
  | "invited"
  | "accepted"
  | "declined"
  | "tentative"
  | "present"
  | "absent"
  | "checked_in"
  | "checked_out"
  | "late"
  | "left_early";

export interface EventAttendee {
  id: string;
  eventId: string;

  userId?: string | null;
  roleId?: string | null;
  sectorId?: string | null;
  locationId?: string | null;

  isOrganizer: boolean;
  required: boolean;

  status: EventAttendeeStatus;

  createdAt: number;
  updatedAt: number;
}

export interface CreateEventAttendeePayload {
  userId?: string | null;
  roleId?: string | null;
  sectorId?: string | null;
  locationId?: string | null;

  isOrganizer?: boolean;
  required?: boolean;
  status?: EventAttendeeStatus;
}

export interface UpdateEventAttendeePayload
  extends Partial<CreateEventAttendeePayload> {}
