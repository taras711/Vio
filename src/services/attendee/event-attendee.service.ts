// /attendee/event-attendee.service.ts

import type {
  EventAttendee,
  CreateEventAttendeePayload,
  UpdateEventAttendeePayload
} from "./event-attendee.types";

const BASE = "/api/events";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const EventAttendeeService = {
  getAll: async (eventId: string): Promise<EventAttendee[]> => {
    const res = await fetch(`${BASE}/${eventId}/attendees`);
    return handle<EventAttendee[]>(res);
  },

  create: async (
    eventId: string,
    payload: CreateEventAttendeePayload
  ): Promise<EventAttendee> => {
    const res = await fetch(`${BASE}/${eventId}/attendees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return handle<EventAttendee>(res);
  },

  update: async (
    eventId: string,
    attendeeId: string,
    payload: UpdateEventAttendeePayload
  ): Promise<void> => {
    const res = await fetch(`${BASE}/${eventId}/attendees/${attendeeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    await handle(res);
  },

  delete: async (eventId: string, attendeeId: string): Promise<void> => {
    const res = await fetch(`${BASE}/${eventId}/attendees/${attendeeId}`, {
      method: "DELETE"
    });
    await handle(res);
  }
};
