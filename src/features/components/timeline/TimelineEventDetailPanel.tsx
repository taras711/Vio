import { useState } from "react";
import { InfoPanel } from "../infopanel/InfoPanel";
import { OverviewFragment } from "./fragments/OverviewFragment";
import { ChatFragment } from "./fragments/ChatFragment";
import { AttendeesFragment } from "./fragments/AttendeesFragment";
import { useAuth } from "@src/auth/AuthContext";
import { EventDetailContext } from "./EventDetailContext";
import type { FeedbackItem, ChatMessage, EventDetail } from "../../../../shared/types";


export function TimelineEventDetailPanel({ event, onClose, setDetailEvent, onEdit }: { event: EventDetail | null; onClose: () => void; setDetailEvent: React.Dispatch<React.SetStateAction<EventDetail | null>>; onEdit: () => void }) {
    const user = useAuth()!;
    if (!event) return null;

const organizerId = event.organizer?.id;
function mapFeedbackToChatMessage(f: FeedbackItem, isAuthor: string): ChatMessage {
    console.log("f", f.reactions);
  return {
    id: f.id,
    message: f.message,
    createdAt: f.createdAt,
    user: {
      id: f.user?.id ?? f.authorId,
      name: f.user?.name ?? "Unknown",
      avatar: f.user?.avatar ?? null
    },
    replyToId: f.replyTo?.id ?? null,
    replyTo: f.replyTo
      ? {
          id: f.replyTo.id,
          message: f.replyTo.message,
          createdAt: f.createdAt,
          user: {
            id: f.replyTo.user.id,
            name: f.replyTo.user.name,
            avatar: f.replyTo.user.avatar
          }
        }
      : null,
    mentions: Array.isArray(f.mentions) ? f.mentions : [],
    reactions: f.reactions ?? [],
    isAuthor: (f.authorId === isAuthor)
  };
}


const [messages, setMessages] = useState<ChatMessage[]>(
  event.feedback.map(f => mapFeedbackToChatMessage(f, String(organizerId) ?? ""))
);



  return (
    <EventDetailContext.Provider
  value={{
    event,
    setDetailEvent,
    messages,
    setMessages
  }}
>
<InfoPanel
  initialFragment={{
    name: "overview",
    props: {}
  }}
  fragments={{
    overview: OverviewFragment,
    chat: ChatFragment,
    attendees: AttendeesFragment,
    // files: FilesFragment,
    // history: HistoryFragment
  }}
/></EventDetailContext.Provider>

  );
}
