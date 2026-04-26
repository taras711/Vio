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
}
