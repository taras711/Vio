import { createContext, useContext } from "react";
import type { ChatMessage, EventDetail } from "../../../../shared/types";
export interface EventDetailContextType {
  event: EventDetail | null;
  setDetailEvent: React.Dispatch<React.SetStateAction<EventDetail | null>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const EventDetailContext = createContext<EventDetailContextType | null>(null);

export function useEventDetail() {
  const ctx = useContext(EventDetailContext);
  if (!ctx) throw new Error("useEventDetail must be used inside <EventDetailProvider>");
  return ctx;
}
