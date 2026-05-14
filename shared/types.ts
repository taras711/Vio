import React from "react";

export interface ChatMessageRow {
  id: string;
  threadId: string;
  authorId: string;
  message: string;
  createdAt: number;
  updatedAt: number;
  replyToId?: string | null;
  mentions?: string | null; // JSON string
  reactions?: string | null;
}

export interface ChatReactionRow {
  messageId: string;
  users: string;
  emoji: string;
}


export interface ChatUser {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface ChatReaction {
  userId: string;
  emoji: string;
}


export interface ChatMessage {
  id: string;
  message: string;
  createdAt: number;
  user: ChatUser;

  replyToId?: string | null;
  replyTo?: ChatMessage | null;

  mentions?: string[]; // vždy pole, nikdy string
  reactions?: ChatReaction[]; // vždy pole, nikdy null

  isAuthor?: boolean;
}

// FragmentTypes.ts
export type FragmentName = string;

export type FragmentState = {
  name: FragmentName;
  props?: any;
};

export type FragmentMap = {
  [key: string]: React.ComponentType<{
    openFragment: (name: FragmentName, props?: any) => void;
  } & any>;
};

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
  message: string;
  createdAt: number;
  authorId: string;

  user: {
    id: string;
    name: string;
    avatar?: string | null;
  };

  replyTo?: {
    id: string;
    message: string;
    user: {
      id: string;
      name: string;
      avatar?: string | null;
    };
  } | null;

  reactions: {
    userId: string;
    users: string[];
    emoji: string;
  }[];

  mentions?: string[]; // pokud backend někdy pošle
  isAuthor?: boolean;
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


