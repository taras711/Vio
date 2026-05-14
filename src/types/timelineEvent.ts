// Jednotný formát pro všechny typy událostí
export type TimelineEventType = "plan" | "task" | "meeting" | "audit" | "custom";

export interface TimelineEventSource {
  module: string;      // např. "plans", "tasks"
  entityId: string;    // ID entity v daném modulu
}

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  start: number;       // timestamp (ms)
  end?: number;        // optional
  color?: string;      // barva eventu
  icon?: string;       // název ikony (můžeš mapovat v UI)
  source: TimelineEventSource;
  status?: "scheduled" | "in-progress" | "completed" | "cancelled";
  description?: string;
  location?: string;
}

export interface FeedbackItem {
  id: string;
  eventId: string;
  message: string;
  createdAt: number;
  authorId: string;
  user: {
    id: string;
    autorId: string;
    name: string;
    avatar?: string | null;
  };
}

export interface EventDetail {
  id: string;
  organizerId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  start: number;
  end: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  color: string;

  location?: {
    id: string;
    name: string;
    description?: string;
    areaId?: string;
    sectorId?: string;
  };

  organizer?: {
    id: string;
    name: string;
    avatar?: string;
  };

  attendees: {
    id: string;
    name: string;
    avatar?: string;
    status: string;
    required: boolean;
  }[];

  feedbackCount: number;
  feedback: FeedbackItem[];

}

