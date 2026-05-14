import { ChatMessageRow } from "../../../shared/types";
import { v4 as uuid } from "uuid";

export class ChatService {
  constructor(private db: any) {}

    async getThreadMessages(threadId: string): Promise<ChatMessageRow[]> {
      // 1) načti všechny zprávy v threadu
      const rows = await this.db.find("chat_messages", { threadId });

      // 2) replyToId seznam (jen stringy)
      const replyIds = rows
          .map((r: any) => r.replyToId)
          .filter((id: string): id is string => typeof id === "string");

      let replyMap = new Map();

      // 3) načti reply zprávy přes RAW SQL
      if (replyIds.length > 0) {
          const placeholders = replyIds.map(() => "?").join(",");
          const sql = `SELECT * FROM chat_messages WHERE id IN (${placeholders})`;

          const replies = await this.db.raw(sql, replyIds);
          replyMap = new Map(replies.map((r: any) => [r.id, r]));
      }
      console.log("REACTIONS", rows[0]?.reactions);

      // 4) vrať obohacené zprávy
      return rows.map((r: any) => ({
          ...r,
          replyTo: r.replyToId ? replyMap.get(r.replyToId) : null,
          mentions: r.mentions ? JSON.parse(r.mentions) : [],
          reactions: r.reactions ? JSON.parse(r.reactions) : []
      }));
    }

async getFullMessage(id: string) {
  const row = await this.db.findById("chat_messages", id);
  if (!row) return null;

  // user
  const user = await this.db.findOne("users", { id: row.authorId });

  // replyTo
  let replyTo = null;
  if (row.replyToId) {
    const r = await this.db.findById("chat_messages", row.replyToId);
    if (r) {
      const ru = await this.db.findOne("users", { id: r.authorId });
      replyTo = {
        id: r.id,
        message: r.message,
        user: {
          id: ru.id,
          name: ru.name,
          avatar: ru.avatarUrl
        }
      };
    }
  }

  // reactions – přímo z chat_messages.reactions
  let reactions = [];
  try {
    reactions = JSON.parse(row.reactions ?? "[]");
  } catch {
    reactions = [];
  }

  return {
    id: row.id,
    threadId: row.threadId,
    message: row.message,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user: {
      id: user.id,
      name: user.name,
      avatar: user.avatarUrl
    },
    replyTo,
    mentions: row.mentions ? JSON.parse(row.mentions) : [],
    reactions
  };
}



    async toggleReaction(messageId: string, userId: string, emoji: string) {
      const message = await this.db.findOne("chat_messages", { id: messageId });

      let reactions = [];
      try {
        reactions = JSON.parse(message.reactions ?? "[]");
      } catch {
        reactions = [];
      }
      console.log("REAC EM", emoji);
      const existing = reactions.find((r: any) => r.emoji === emoji);

      if (existing) {
        // toggle off
        existing.users = existing.users.filter((u: string) => u !== userId);
        if (existing.users.length === 0) {
          reactions = reactions.filter((r: any) => r.emoji !== emoji);
        }
      } else {
        // add reaction
        reactions.push({ emoji, users: [userId] });
      }
    console.log("REAC", reactions);
      await this.db.update("chat_messages", { id: messageId }, {
        reactions: JSON.stringify(reactions)
      });

      return {
        ...message,
        reactions
      };
    }

  async getMessagesByIds(ids: string[]): Promise<ChatMessageRow[]> {
    if (!ids.length) return [];

    const placeholders = ids.map(() => "?").join(",");
    const sql = `SELECT * FROM chat_messages WHERE id IN (${placeholders})`;

    const rows = await this.db.raw(sql, ids);

    return rows.map((r: any) => ({
        id: r.id,
        threadId: r.threadId,
        authorId: r.authorId,
        message: r.message,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        replyToId: r.replyToId,
        mentions: r.mentions ? JSON.parse(r.mentions) : []
    }));
    }


  async addMessage(params: {
    threadId: string;
    authorId: string;
    message: string;
    replyToId?: string | null;
    mentions?: string[];
  }): Promise<ChatMessageRow> {
    const now = Date.now();

    const row: ChatMessageRow = {
      id: uuid(),
      threadId: params.threadId,
      authorId: params.authorId,
      message: params.message,
      createdAt: now,
      updatedAt: now,
      replyToId: params.replyToId ?? null,
      mentions: params.mentions ? JSON.stringify(params.mentions) : null
    };

    await this.db.insert("chat_messages", row);
    return row;
  }

  async deleteMessage(id: string): Promise<void> {
    await this.db.delete("chat_messages", id);
  }

  async getMessageById(id: string): Promise<ChatMessageRow | null> {
    return this.db.findById("chat_messages", id);
  }
}
