import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { TimelineEvent } from "@src/types/timelineEvent";
import api from "../../../utils/api"; // podle toho, kde máš axios instance
import { useAuth } from "@src/auth/AuthContext";
import { usePermission } from "@src/auth/PermissionContext";

interface TimelineContextType {
  events: TimelineEvent[];
  now: number;
  windowHours: number;
  setWindowHours: (h: number) => void;
  reload: () => void;
}

const TimelineContext = createContext<TimelineContextType | null>(null);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [windowHours, setWindowHours] = useState(4); // default 4 hodiny
  const { user } = useAuth();
  const { can } = usePermission();
console.log("TimelineProvider render", { user, events });
  // auto-update "now"
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // TESTOVACÍ DATA – odstraníme, až bude backend
useEffect(() => {
  const nowTs = Date.now();

  setEvents([
    {
      id: "test1",
      type: "task",
      title: "Test event -5 min",
      start: nowTs - 5 * 60 * 1000,
      end: nowTs + 10 * 60 * 1000,
      color: "#4caf50",
      icon: "TaskIcon",
      source: { module: "tasks", entityId: "1" },
    },
    {
      id: "test2",
      type: "plan",
      title: "Test event +20 min",
      start: nowTs + 20 * 60 * 1000,
      end: nowTs + 40 * 60 * 1000,
      color: "#1976d2",
      icon: "PlanIcon",
      source: { module: "plans", entityId: "2" },
    },
    {
      id: "test3",
      type: "meeting",
      title: "Test event +1 hod",
      start: nowTs + 60 * 60 * 1000,
      color: "#ff9800",
      icon: "MeetingIcon",
      source: { module: "meetings", entityId: "3" },
    },
  ]);
}, []);


  async function load() {
    const from = now - (windowHours / 2) * 60 * 60 * 1000;
    const to = now + (windowHours / 2) * 60 * 60 * 1000;

    try {
      const res = await api.get("/timeline", {
        params: { from, to },
      });
      setEvents(res.data as TimelineEvent[]);
    } catch (e) {
      console.warn("Failed to load timeline events", e);
      setEvents([]);
    }
  }

  // reload při změně okna nebo času
  // useEffect(() => {
  //   load();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [windowHours]);

  const value = useMemo(
    () => ({
      events,
      now,
      windowHours,
      setWindowHours,
      reload: load,
    }),
    [events, now, windowHours]
  );
  // if (!user || !can("timeline.view")) {
  //   return <>{children}</>;
  // }
  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used inside <TimelineProvider>");
  return ctx;
}
