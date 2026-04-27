/**
 * @module modules/timeline/TimelineService
 * @description Fetches timeline events from the database.
 *
 * Visibility rules:
 *  - Superadmin / wildcard permission → all events in window
 *  - Regular user → only events where they appear in event_attendees
 *    (by userId, or by roleId if role-to-id mapping is present, or by sectorId)
 */

import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";
import type { TimelineEventRow, TimelineEventDto, TimelineEventType } from "./TimelineTypes";

export class TimelineService {
  constructor(private db: DatabaseAdapter) {}

  /**
   * Returns timeline events for an admin/superadmin — no attendee filter.
   */
  async getAllEvents(from: number, to: number): Promise<TimelineEventDto[]> {
    const rows = await this.db.raw(
      `SELECT
        e.id,
        e.name,
        e.startTime,
        e.endTime,
        e.color,
        e.type,
        e.description,
        e.locationId,
        NULL as attendeeStatus,
        0 as isOrganizer,
        (SELECT COUNT(*) FROM event_feedback ef WHERE ef.eventId = e.id) as feedbackCount
      FROM events e
      WHERE e.startTime <= ? AND e.endTime >= ?
      ORDER BY e.startTime ASC`,
      [to, from]
    );

    return (rows as TimelineEventRow[]).map(this.mapRow);
  }

  /**
   * Returns only the events where the user is explicitly listed as an attendee.
   * Also enriches with their personal attendee status and organizer flag.
   */
  async getEventsForUser(
    userId: string,
    from: number,
    to: number
  ): Promise<TimelineEventDto[]> {
    const rows = await this.db.raw(
      `SELECT
        e.id,
        e.name,
        e.startTime,
        e.endTime,
        e.color,
        e.type,
        e.description,
        e.locationId,
        ea.status     AS attendeeStatus,
        ea.isOrganizer,
        (SELECT COUNT(*) FROM event_feedback ef WHERE ef.eventId = e.id) AS feedbackCount
      FROM events e
      INNER JOIN event_attendees ea
        ON ea.eventId = e.id AND ea.userId = ?
      WHERE e.startTime <= ? AND e.endTime >= ?
      ORDER BY e.startTime ASC`,
      [userId, to, from]
    );

    return (rows as TimelineEventRow[]).map(this.mapRow);
  }

  /**
   * Returns events for a user, extended with events assigned to their role or sector.
   * Useful when role / sector IDs are stored in event_attendees.
   */
  async getEventsForUserExtended(
    userId: string,
    roleId: string | null,
    sectorId: string | null,
    from: number,
    to: number
  ): Promise<TimelineEventDto[]> {
    // Build a dynamic OR clause depending on what identifiers we have
    const conditions: string[] = ["ea.userId = ?"];
    const params: (string | number)[] = [userId];

    if (roleId) {
      conditions.push("ea.roleId = ?");
      params.push(roleId);
    }

    if (sectorId) {
      conditions.push("ea.sectorId = ?");
      params.push(sectorId);
    }

    const whereAttendee = conditions.join(" OR ");

    params.push(to, from);

    const rows = await this.db.raw(
      `SELECT DISTINCT
        e.id,
        e.name,
        e.startTime,
        e.endTime,
        e.color,
        e.type,
        e.description,
        e.locationId,
        -- personal status (NULL if only matched via role/sector)
        (SELECT ea2.status FROM event_attendees ea2 WHERE ea2.eventId = e.id AND ea2.userId = ?) AS attendeeStatus,
        (SELECT ea2.isOrganizer FROM event_attendees ea2 WHERE ea2.eventId = e.id AND ea2.userId = ?) AS isOrganizer,
        (SELECT COUNT(*) FROM event_feedback ef WHERE ef.eventId = e.id) AS feedbackCount
      FROM events e
      INNER JOIN event_attendees ea ON ea.eventId = e.id
      WHERE (${whereAttendee}) AND e.startTime <= ? AND e.endTime >= ?
      ORDER BY e.startTime ASC`,
      [userId, userId, ...params]
    );

    return (rows as TimelineEventRow[]).map(this.mapRow);
  }

  // ─── helpers ────────────────────────────────────────────────────────────────

  private mapRow = (row: TimelineEventRow): TimelineEventDto => ({
    id: row.id,
    type: (row.type as TimelineEventType) || "event",
    title: row.name,
    start: Number(row.startTime),
    end: Number(row.endTime),
    color: row.color || "#1976d2",
    source: {
      module: "events",
      entityId: row.id,
    },
    meta: {
      attendeeStatus: row.attendeeStatus ?? null,
      isOrganizer: Boolean(row.isOrganizer),
      feedbackCount: Number(row.feedbackCount ?? 0),
      locationId: row.locationId ?? null,
    },
  });
}