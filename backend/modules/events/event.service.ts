import crypto from "crypto";
import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";

export interface EventRow {
  id: string;
  name: string;
  description: string | null;
  startTime: number;
  endTime: number;
  status: string | null;
  color: string | null;
  type: string | null;
  locationId: string | null;
  organizerId: string | null;
  avatarUrl: string | null;
}

interface FeedbackRow {
  id: string;
  eventId: string;
  authorId: string;
  message: string;
  createdAt: number;
  updatedAt: number;
}

export class EventService {
  constructor(private db: DatabaseAdapter) {}

  async create(data: any) {
    const {
      name,
      description,
      locationId,
      organizerId,
      startTime,
      endTime,
      color,
      type,
      allDay,
      isPrivate,
      attendees,
      isRecurring,
      recurrenceRule,
      recurrenceEnd,
      recurrenceCount
    } = data;

    const id = crypto.randomUUID();
    
    // 1) Uložení eventu
    await this.db.insert("events", {
      id,
      name,
      description,
      locationId,
      organizerId,
      startTime,
      endTime,
      color,
      type,
      allDay,
      isPrivate,
      isRecurring,
      recurrenceRule,
      recurrenceEnd,
      recurrenceCount,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // 2) Uložení attendees
    if (attendees?.length > 0) {
      for (const a of attendees) {
        await this.db.insert("event_attendees", {
          id: crypto.randomUUID(),
          eventId: id,
          userId: a.userId,
          role: a.role ?? "attendee"
        });
      }
    }

    // 3) Vrátíme event
    return await this.db.findById("events", id);
  }

  async getByIdRaw(id: string): Promise<EventRow | null> {
    return this.db.findOne("events", { id });
  }


  async getLocation(locationId: string): Promise<EventRow | null> {
    return this.db.findOne("locations", { id: locationId });
  }

  async getAttendeesWithUsers(eventId: string) {
    return this.db.raw(`
      SELECT ea.userId, ea.status, u.name as userName, u.avatarUrl, ea.required
      FROM event_attendees ea
      JOIN users u ON u.id = ea.userId
      WHERE ea.eventId = ?
    `, [eventId]);
  }

  async getFeedbackList(eventId: string) {
    return this.db.find("chat_messages", { threadId: eventId });
  }

  async addFeedback(eventId: string, data: any) {
    const id = crypto.randomUUID();
    const now = Date.now();

    await this.db.insert("chat_messages", {
      id,
      eventId,
      authorId: data.authorId,
      message: data.message,
      createdAt: now,
      updatedAt: now
    });

    return this.db.findById<FeedbackRow>("chat_messages", id);
  }


  async getFeedbackById(id: string):Promise<FeedbackRow | null> {
    return this.db.findById("chat_messages", id);
  }

  async deleteMessage(id: string) {
    return this.db.delete("chat_messages", { id });
  }


  async getUser(userId: string): Promise<EventRow | null> {
    return this.db.findOne("users", { id: userId });
  }

  async getFeedbackCount(eventId: string) {
    const rows = await this.db.raw(`
      SELECT COUNT(*) as count 
      FROM chat_messages
      WHERE threadId = ?
    `, [eventId]) as { count: number }[];

    return Number(rows?.[0]?.count ?? 0);
  }

  async getAll() {
    return this.db.find("events", {});
  }

  async getById(id: string):Promise<EventRow | null> {
    return this.db.findById("events", id);
  }

  async update(id: string, data: any) {
    const { attendees, status, ...eventData } = data;
    await this.db.update("events", { id }, { ...eventData, status: status ?? "scheduled", updatedAt: Date.now() });
    return this.db.findById("events", id);
  }

    async delete(eventId: string) {
        return this.db.delete("events", { id: eventId });
    }


    async getAttendees(eventId: string) {
        return this.db.find("event_attendees", { eventId });
    }

    async addAttendee(eventId: string, data: any) {
        const id = crypto.randomUUID();

        await this.db.insert("event_attendees", {
            id,
            eventId,
            userId: data.userId ?? null,
            roleId: data.roleId ?? null,
            sectorId: data.sectorId ?? null,
            locationId: data.locationId ?? null,
            isOrganizer: data.isOrganizer ?? false,
            required: data.required ?? true,
            status: data.status ?? "invited",
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

        return this.db.findById("event_attendees", id);
    }

    async updateAttendee(attendeeId: string, data: any) {
        await this.db.update("event_attendees", { id: attendeeId }, {
            ...data,
            updatedAt: Date.now()
        });
    }

    async deleteAttendee(attendeeId: string) {
        await this.db.delete("event_attendees", { id: attendeeId });
    }

    async deleteAllAttendees(eventId: string) {
        await this.db.delete("event_attendees", { eventId });
    }

}

