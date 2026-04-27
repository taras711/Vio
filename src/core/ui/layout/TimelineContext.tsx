import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { TimelineEvent } from "@src/types/timelineEvent";
import api from "../../../utils/api";
import { useAuth } from "@src/auth/AuthContext";

// ─── context shape ───────────────────────────────────────────────────────────

interface TimelineContextType {
  events: TimelineEvent[];
  loading: boolean;
  error: string | null;
  now: number;
  windowHours: number;
  setWindowHours: (h: number) => void;
  reload: () => void;
}

const TimelineContext = createContext<TimelineContextType | null>(null);

// ─── provider ────────────────────────────────────────────────────────────────

export function TimelineProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [events,      setEvents]      = useState<TimelineEvent[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [now,         setNow]         = useState(() => Date.now());
  const [windowHours, setWindowHours] = useState(4);

  // Keep "now" up-to-date every 30 s
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Debounce load so rapid windowHours changes don't spam the API
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!user) return; // not authenticated yet

    const from = now - (windowHours / 2) * 60 * 60 * 1000;
    const to   = now + (windowHours / 2) * 60 * 60 * 1000;

    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/timeline", { params: { from, to } });
      const raw: any[] = Array.isArray(res.data) ? res.data : [];

      // Map backend DTO → frontend TimelineEvent
      const mapped: TimelineEvent[] = raw.map((item) => ({
        id:    item.id,
        type:  item.type  ?? "event",
        title: item.title ?? item.name ?? "Event",
        start: item.start,
        end:   item.end   ?? item.start + 60 * 60 * 1000,
        color: item.color ?? "#1976d2",
        source: item.source ?? { module: "events", entityId: item.id },
        // pass through any extra meta for consumers
        ...(item.meta ? { meta: item.meta } : {}),
      }));

      setEvents(mapped);
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? err?.message ?? "Failed to load timeline";
      console.warn("[TimelineContext] load error:", msg);
      setError(msg);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user, now, windowHours]);

  // Re-fetch whenever the window changes (debounced 300 ms)
  useEffect(() => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(load, 300);
    return () => {
      if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    };
  }, [load]);

  const value = useMemo(
    () => ({ events, loading, error, now, windowHours, setWindowHours, reload: load }),
    [events, loading, error, now, windowHours, load]
  );

  return (
    <TimelineContext.Provider value={value}>
      {children}
    </TimelineContext.Provider>
  );
}

// ─── hook ────────────────────────────────────────────────────────────────────

export function useTimeline() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimeline must be used inside <TimelineProvider>");
  return ctx;
}