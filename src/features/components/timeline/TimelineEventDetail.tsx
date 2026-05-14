import { Box, Button, Chip, IconButton, Typography, TextField, Divider, AvatarGroup, Avatar, Tooltip } from "@mui/material";
import { Close, Delete, Edit} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuth } from "@src/auth/AuthContext";
import api from "@src/utils/api";
import type { EventDetail } from "@src/types/timelineEvent";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CustomRangeDay } from "../../../core/ui/primitives/CustomRangeDay";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { ChatThread } from "../../../core/ui/primitives/ChatThread";
import { formatDateTime } from "@src/utils/dateUtils";
import RoomIcon from "@mui/icons-material/Room";
import { useNavigate } from "react-router-dom";
import type { ChatMessage,  } from "../../../../shared/types";

export function TimelineEventDetailPanel({ event, onClose, setDetailEvent, onEdit }: { event: EventDetail | null; onClose: () => void; setDetailEvent: React.Dispatch<React.SetStateAction<EventDetail | null>>; onEdit: () => void }) {
    const [newFeedback, setNewFeedback] = useState("");
    const [feedback, setFeedback] = useState(event?.feedback ?? []);
    const [messages, setMessages] = useState<ChatMessage[]>(event?.feedback ?? []);

    const { user } = useAuth()!;

    const navigate = useNavigate();
    if (!event) return null;

async function handleSendChat(payload: { message: string; replyToId?: string; mentions?: string[] }) {
  const res = await api.post(`/events/${event?.id}/feedback`, payload);

  if (res.status === 200 || res.status === 201) {
    const created = res.data;

    // 1) autor
    const authorUser = {
      id: String(user.id),
      name: user.email ?? user.name ?? "Unknown",
      avatar: user.avatar ?? null
    };

    // 2) reply snapshot – MUSÍ být z messages, ne z event.feedback
    let replySnapshot = null;
    if (created.replyToId) {
      const original = messages.find(m => m.id === created.replyToId);
      if (original) {
        replySnapshot = {
          id: original.id,
          user: original.user,
          message: original.message
        };
      }
    }

    // 3) enriched zpráva
    const enriched = {
      ...created,
      user: authorUser,
      replyTo: replySnapshot,
      mentions: created.mentions ?? [],
      reactions: created.reactions ?? []
    };

    // 4) přidáme enriched zprávu do messages → ChatThread se rerenderuje
    setMessages(prev => [...prev, enriched]);

    // 5) aktualizujeme i detail eventu (kvůli jiným částem UI)
    setDetailEvent(prev =>
      prev
        ? {
            ...prev,
            feedback: [...prev.feedback, enriched],
            feedbackCount: prev.feedbackCount + 1
          }
        : prev
    );
  }
}


async function handleToggleReaction(messageId: string, emoji: string) {
  const res = await api.post(
    `/events/${event?.id}/feedback/${messageId}/reaction`,
    { emoji }
  );

  if (res.status === 200) {
    const updated = res.data; // backend message (raw)

    // 1) ChatThread – jen aktualizujeme reactions
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? {
              ...m,                     // ⭐ zachová isAuthor, isOrganizer, user, replyTo, mentions…
              reactions: updated.reactions
            }
          : m
      )
    );

    // 2) EventDetail – jen aktualizujeme reactions
    setDetailEvent(prev =>
      prev
        ? {
            ...prev,
            feedback: prev.feedback.map(f =>
              f.id === messageId
                ? {
                    ...f,               // ⭐ zachová FE-only data
                    reactions: updated.reactions
                  }
                : f
            )
          }
        : prev
    );
  }
}



    async function handleDeleteChat(messageId: string) {
        const res = await api.delete(`/events/${event?.id}/feedback/${messageId}`);

        if (res.status === 200) {

            // 1) smažeme zprávu z messages → ChatThread se rerenderuje
            setMessages(prev => prev.filter(m => m.id !== messageId));

            // 2) smažeme zprávu i z detailu eventu
            setDetailEvent(prev =>
            prev
                ? {
                    ...prev,
                    feedback: prev.feedback.filter(f => f.id !== messageId),
                    feedbackCount: Math.max(prev.feedbackCount - 1, 0)
                }
                : prev
            );
        }
    }

    function getEventProgress(start: number, end: number): number {
        const now = Date.now();
        if (now <= start) return 0;
        if (now >= end) return 100;
        return Math.round(((now - start) / (end - start)) * 100);
    }

    async function handleAddFeedback() {
        const message = newFeedback.trim();
        if (!message) return;

        const res = await api.post(`/events/${event?.id}/feedback`, { message });

        if (res.status === 200 || res.status === 201) {
            const created = res.data;

            // aktualizujeme detail eventu v paměti
            setDetailEvent((prev: EventDetail | null): EventDetail | null => {
                if (!prev) return prev;

                return {
                    ...prev,
                    feedback: [...(prev.feedback ?? []), created],
                    feedbackCount: prev.feedbackCount + 1
                };
            });




            setNewFeedback("");
        }
    }

    async function handleDeleteFeedback(feedbackId: string) {
        const res = await api.delete(`/events/${event?.id}/feedback/${feedbackId}`);

        if (res.status === 200) {
            setDetailEvent(prev =>
            prev
                ? {
                    ...prev,
                    feedback: prev.feedback?.filter(f => f.id !== feedbackId) ?? [],
                    feedbackCount: Math.max((prev.feedbackCount ?? 1) - 1, 0)
                }
                : prev
            );
        }
    }


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
        <Typography variant="h6" fontWeight={600}
        sx={{
            textDecoration: event.status === "cancelled" ? "line-through" : "none",
            color: event.status === "cancelled" ? "#000000b8" : "inherit",
            opacity: event.status === "cancelled" ? 0.5 : 1,
            // three dots for long titles
            WebkitLineClamp: 1,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            overflow: "hidden",
            cursor: "pointer",
        }}
        >
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line", textTransform: "capitalize" }}>
          {event.type}
        </Typography></Box>
        <IconButton onClick={onClose} sx={{ maxHeight: "fit-content" }}>
          <Close />
        </IconButton>
      </Box>

      {/* Status */}
      <Chip
        label={event.status}
        color={
          event.status === "cancelled"
            ? "error"
            : event.status === "completed"
            ? "success"
            : event.status === "in-progress"
            ? "warning"
            : "default"
        }
        //progress inside chip for in-progress events
        sx={{
            mb: 2,
            position: "relative",
            overflow: "hidden",
            color: "#fff",
            backgroundColor:
            event.status === "cancelled"
                ? "#b71c1c"
                : event.status === "completed"
                ? "#2e7d32"
                : event.status === "in-progress"
                ? "#f9a825"
                : "#1976d2",

            "&::before": event.status === "in-progress"
            ? {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${getEventProgress(event.start, event.end ?? event.start)}%`,
                backgroundColor: "rgba(255,255,255,0.25)",
                transition: "width 0.3s ease",
                }
            : {},
        }}
      />

      {/* Mini calendar */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={dayjs(event.start)}
            readOnly
            renderDay={(day, selectedDates, DayComponentProps) =>
                CustomRangeDay(
                    day,
                    selectedDates as Dayjs[],
                    DayComponentProps,
                    dayjs(event.start),
                    dayjs(event.end))
                }
                onChange={() => {}}
                renderInput={(params) => <TextField {...params} sx={{ display: "none" }} />}
        />
        </LocalizationProvider>
        <Divider sx={{ my: 2 }} />
      {/* Exact times */}
      <Typography variant="body2" sx={{ mb: 1 }}>
        Start: {formatDateTime(event.start)}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        End: {formatDateTime(event.end ?? event.start)}
      </Typography>

      {/* Location */}
      {event?.location && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          <RoomIcon fontSize="small" sx={{ mr: 1 }} color="action" />
          {event.location?.name}
        </Typography>
      )}
        <Divider />
      {/* Attendees */}
      {event.attendees.length > 0 && (
        <Box sx={{ display: "flex", mb: 2, alignItems: "center", mt: 2}}>
        <Box sx={{ display: "flex", mb: 2, alignItems: "center"}}>
            
            <Tooltip title={event?.organizer?.name + " (organizer)"} >
                <Avatar src={event?.organizer?.avatar ?? ""} sx={{ mr:1 }}/>
            </Tooltip>
            <AvatarGroup max={5}>
                {event.attendees.map((attendee) => (
                    <Tooltip key={attendee.id} title={`${attendee.name} (${attendee?.required ? "required" : "optional"})`}>
                        <Avatar key={attendee.id} src={attendee?.avatar ?? ""} />
                    </Tooltip>
                ))}
            </AvatarGroup>
        </Box>
        {event.attendees.length > 5 && <Typography variant="body1" sx={{ ml: 1 }}> + {event.attendees.length - 5}</Typography>}
        </Box>
      )}

        {/* Description */}
      {event.description && (
        <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
          {event.description}
        </Typography>
      )}

      {/* Feedback Section */}
    <ChatThread
        threadId={event.id}
        messages={messages}
        onSend={handleSendChat}
        onDelete={handleDeleteChat}
        currentUserId={String(user.id)}
        onToggleReaction={handleToggleReaction}
        organizerId={event.organizer?.id ?? event.organizerId}
      />


      <Box sx={{ flexGrow: 1 }} />

      {/* Actions */}
      <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={onEdit}>
        Edit
      </Button>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => navigate(`/events/${event.id}`)}
      >
        Open
      </Button>
    </Box>
  );
}

