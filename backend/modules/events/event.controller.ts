import { Request, Response } from "express";
import { EventService } from "./event.service";
import { ChatService } from "../chat/ChatService";
import { UserService } from "../users/UserService";

export class EventController {
    constructor(
        private service: EventService,
        private chatService: ChatService,
        private userService: UserService,
    ) {}

  async create(req: Request, res: Response) {
    try {
      const event = await this.service.create(req.body);
      res.status(201).json(event);
    } catch (err) {
      console.error("Event create error:", err);
      res.status(500).json({ error: "Failed to create event" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const events = await this.service.getAll();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: "Failed to load events" });
    }
  }
  
async toggleReaction(req: Request, res: Response) {
  try {
    const { emoji } = req.body;
    const { feedbackId: messageId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Missing user" });
    }

    // 1) toggle v DB
    await this.chatService.toggleReaction(String(messageId), String(userId), emoji);

    // 2) načti kompletní enriched zprávu
    const full = await this.chatService.getFullMessage(String(messageId));

    res.json(full);
  } catch (err) {
    console.error("Toggle reaction error:", err);
    res.status(500).json({ error: "Failed to toggle reaction" });
  }
}



    async getDetail(req: Request, res: Response) {
    try {
        const id = String(req.params.id);

        // 1) základní event
        const event = await this.service.getByIdRaw(id);
        if (!event) return res.status(404).json({ error: "Event not found" });

        // 2) location
        const location = event.locationId
        ? await this.service.getLocation(event.locationId)
        : null;

        // 3) attendees
        const attendees = await this.service.getAttendeesWithUsers(id);

        // 4) chat messages (jediný zdroj pravdy)
        const messages = await this.chatService.getThreadMessages(event.id);

        // 5) user info
        const authorIds = [...new Set(messages.map(m => String(m.authorId)))];
        const users = await this.userService.getByIds(authorIds);
        const userMap = new Map(users.map(u => [String(u.id), u]));

        // 6) reply snapshot
        const replyIds = messages
            .map(m => m.replyToId)
            .filter((id): id is string => typeof id === "string");



        let replyMap = new Map();
        if (replyIds.length > 0) {
            const replies = await this.chatService.getMessagesByIds(replyIds);
            replyMap = new Map(replies.map(r => [r.id, r]));
        }

        const organizer = event.organizerId
            ? await this.service.getUser(event.organizerId)
            : null;


        // 7) feedback DTO (chat)
        const feedback = messages.map(m => {
        const reply = m.replyToId ? replyMap.get(m.replyToId) : null;

        return {
            id: m.id,
            message: m.message,
            createdAt: m.createdAt,
            authorId: m.authorId,

            user: {
            id: m.authorId,
            name: userMap.get(String(m.authorId))?.name ?? "Unknown",
            avatar: userMap.get(String(m.authorId))?.avatarUrl ?? null
            },

            replyTo: reply
            ? {
                id: reply.id,
                user: {
                    id: reply.authorId,
                    name: userMap.get(String(reply.authorId))?.name ?? "Unknown",
                    avatar: userMap.get(String(reply.authorId))?.avatarUrl ?? null
                },
                message: reply.message
                }
            : null,

            mentions: m.mentions ?? [],     // ⭐ FIX
            reactions: m.reactions ?? []    // ⭐ FIX
        };
        });


        // 8) finální DTO
        const dto = {
        id: event.id,
        title: event.name,
        description: event.description,
        start: Number(event.startTime),
        end: Number(event.endTime),
        status: this.computeStatus(event.startTime, event.endTime, String(event.status)),
        color: event.color || "#1976d2",
        type: event.type,

        location: location
            ? { id: location.id, name: location.name }
            : null,

        organizer: event.organizerId
            ? {
                id: organizer?.id,
                name: organizer?.name,
                avatar: organizer?.avatarUrl
            }
            : null,

        attendees: attendees.map((a: any) => ({
            id: a.userId,
            name: a.userName,
            avatar: a.avatarUrl,
            status: a.attendeeStatus,
            required: a.required
        })),

        feedbackCount: feedback.length,
        feedback
        };

        res.json(dto);
    } catch (err) {
        console.error("getDetail error:", err);
        res.status(500).json({ error: "Failed to load event detail" });
    }
    }

  async getById(req: Request, res: Response) {
    try {
      const event = await this.service.getById(String(req.params.id));
      if (!event) return res.status(404).json({ error: "Not found" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: "Failed to load event" });
    }
  }

    async update(req: Request, res: Response) {
    try {
        await this.service.update(String(req.params.id), req.body);
        res.json({ success: true });
    } catch (err) {
        console.error("Event update error:", err); // ← TADY
        res.status(500).json({ error: "Failed to update event" });
    }
    }

    async delete(req: Request, res: Response) {
        try {
            const eventId = String(req.params.id);

            // 1) smazat attendees
            await this.service.deleteAllAttendees(eventId);

            // 2) smazat event
            await this.service.delete(eventId);

            res.json({ success: true });
        } catch (err) {
            console.error("Delete event error:", err);
            res.status(500).json({ error: "Failed to delete event" });
        }
    }

  async getAttendees(req: Request, res: Response) {
    try {
        const attendees = await this.service.getAttendees(String(req.params.id));
        res.json(attendees);
    } catch (err) {
        console.error("Get attendees error:", err);
        res.status(500).json({ error: "Failed to load attendees" });
    }
    }

    async addAttendee(req: Request, res: Response) {
    try {
        const attendee = await this.service.addAttendee(String(req.params.id), req.body);
        res.status(201).json(attendee);
    } catch (err) {
        console.error("Add attendee error:", err);
        res.status(500).json({ error: "Failed to add attendee" });
    }
    }

    async updateAttendee(req: Request, res: Response) {
    try {
        await this.service.updateAttendee(String(req.params.attendeeId), req.body);
        res.json({ success: true });
    } catch (err) {
        console.error("Update attendee error:", err);
        res.status(500).json({ error: "Failed to update attendee" });
    }
    }

    async deleteAttendee(req: Request, res: Response) {
        try {
            await this.service.deleteAttendee(String(req.params.attendeeId));
            res.json({ success: true });
        } catch (err) {
            console.error("Delete attendee error:", err);
            res.status(500).json({ error: "Failed to delete attendee" });
        }
    }

    async deleteAllAttendees(req: Request, res: Response) {
        try {
            await this.service.deleteAllAttendees(String(req.params.id));
            res.json({ success: true });
        } catch (err) {
            console.error("Delete all attendees error:", err);
            res.status(500).json({ error: "Failed to delete attendees" });
        }
    }
    async addFeedback(req: Request, res: Response) {
        try {
            const eventId = String(req.params.id);
            const userId = req.auth?.userId; // ✔ správné pole
            const { message, replyToId, mentions } = req.body;

            if(!userId) return res.status(401).json({ error: "Unauthorized" });
            if (!message) {
                return res.status(400).json({ error: "Message is required" });
            }

            const event = await this.service.getById(eventId);
            if (!event) return res.status(404).json({ error: "Event not found" })

            const created = await this.chatService.addMessage({
                threadId: eventId,
                authorId: userId,
                message: message.trim(),
                replyToId: replyToId ?? null,
                mentions: Array.isArray(mentions) ? mentions : undefined
            });

            // načtení autora
            const user = await this.service.getUser(String(userId));
            if (!user) {
            return res.status(500).json({ error: "User not found" });
            }

            // FE-ready objekt
             res.status(201).json({
                id: created.id,
                message: created.message,
                createdAt: created.createdAt,
                user: {
                    id: userId,
                    name: user?.name ?? "Unknown",
                    avatar: user?.avatarUrl ?? null
                },
                replyToId: created.replyToId,
                mentions: created.mentions ? JSON.parse(created.mentions) : []
                });

        } catch (err) {
            console.error("Add feedback error:", err);
            res.status(500).json({ error: "Failed to add feedback" });
        }
    }



    async deleteMessage(req: Request, res: Response) {
    try {
        const eventId = String(req.params.id);
        const feedbackId = String(req.params.feedbackId);
        const userId = req.auth?.userId;

        if (!userId) return res.status(401).json({ error: "Not authenticated" });

        const msg = await this.chatService.getMessageById(feedbackId);

        if (!msg || msg.threadId !== eventId) {
        return res.status(404).json({ error: "Feedback not found" });
        }

        const event = await this.service.getById(eventId);
        if (!event) {
        return res.status(404).json({ error: "Event not found" });
        }

        const isAuthor = msg.authorId === userId;
        const isOrganizer = String(event.organizerId) === String(userId);

        if (!isAuthor && !isOrganizer) {
        return res.status(403).json({ error: "Not allowed" });
        }

        await this.service.deleteMessage(feedbackId);

        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Delete feedback error:", err);
        res.status(500).json({ error: "Failed to delete feedback" });
    }
    }

    /* ----------------------------- HELPER FUNCTION ------------------------------------ */
      private computeStatus(start: number, end: number, dbStatus: string) {
        const now = Date.now();

        // ruční override
        if (dbStatus === "cancelled") return "cancelled";

        // ruční override
        if (dbStatus === "completed") return "completed";

        // automatika
        if (now < start) return "scheduled";
        if (now >= start && now <= end) return "in-progress";
        if (now > end) return "completed";

        return "scheduled";
    }


}
