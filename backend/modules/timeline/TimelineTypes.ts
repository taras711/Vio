/**
 * @module modules/timeline/TimelineTypes
 * @description Shared types for the timeline module.
 */

export type TimelineEventType =
  | "event"
  | "task"
  | "plan"
  | "meeting"
  | "audit"
  | "maintenance"
  | "custom";

export type AttendeeStatus =
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

export interface TimelineEventRow {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  color: string;
  type: string;
  description: string | null;
  locationId: string | null;
  attendeeStatus: AttendeeStatus | null;
  isOrganizer: number | boolean;
  feedbackCount: number;
}

export interface TimelineEventDto {
  id: string;
  type: TimelineEventType;
  title: string;
  start: number;
  end: number;
  color: string;
  source: {
    module: string;
    entityId: string;
  };
  meta: {
    attendeeStatus: AttendeeStatus | null;
    isOrganizer: boolean;
    feedbackCount: number;
    locationId: string | null;
  };
}