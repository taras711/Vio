import { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import api from "@src/utils/api";
import type { FragmentState, ChatMessage, FragmentName, EventDetail } from "../../../../../shared/types";
import { useAuth } from "@src/auth/AuthContext";
import { ChatThread } from "@ui/primitives/ChatThread";
import { FragmentHeader } from "@ui/primitives/FragmentHeader";
import { useEventDetail } from "../EventDetailContext";
export function ChatFragment({
  openFragment
}: {
  openFragment: (name: FragmentName, props?: any) => void;
}) {
    const { event, messages, setMessages, setDetailEvent } = useEventDetail();


  const { user } = useAuth()!;

    if (!user || !user.id) {
    return (
        <Box sx={{ p: 2 }}>
        <CircularProgress />
        </Box>
    );
    }

    async function handleSendChat(payload: { message: string; replyToId?: string; mentions?: string[] }) {
        try {
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
        } catch (error) {
        console.error(error);
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

async function handleToggleReaction(messageId: string, emoji: string) {
  if (!emoji) return;

  const res = await api.post(
    `/events/${event?.id}/feedback/${messageId}/reaction`,
    { emoji }
  );

  const updated = res.data;

  // ⭐ 1) ChatThread – aktualizujeme JEN reactions
  setMessages(prev =>
    prev.map(m =>
      m.id === messageId
        ? {
            ...m,                     // ⭐ zachová isAuthor, isOrganizer, user, replyTo, mentions…
            reactions: updated.reactions ?? []
          }
        : m
    )
  );

  // ⭐ 2) EventDetail – aktualizujeme JEN reactions
  setDetailEvent(prev =>
    prev
      ? {
          ...prev,
          feedback: prev.feedback.map(f =>
            f.id === messageId
              ? {
                  ...f,               // ⭐ zachová FE-only data
                  reactions: updated.reactions ?? []
                }
              : f
          )
        }
      : prev
  );
}



    return (
        <>
            <FragmentHeader
                name={`Chat (${event?.feedbackCount})`}
                description={`${event?.type}: ${event?.title}`}
                onBack={() => openFragment("overview")}
            />
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Feedback Section */}
                <ChatThread
                    style={{ height: "100%" }}
                    threadId={String(event?.id)}
                    messages={messages}
                    onSend={handleSendChat}
                    onDelete={handleDeleteChat}
                    currentUserId={String(user.id)}
                    onToggleReaction={handleToggleReaction}
                    organizerId={event?.organizer?.id ?? event?.organizerId}
                />
            </Box>
        </>
    )
}