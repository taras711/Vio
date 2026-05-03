// /attendee/useEventAttendees.ts

import { useEffect, useState } from "react";
import { EventAttendeeService } from "./event-attendee.service";
import type { EventAttendee } from "./event-attendee.types";

export function useEventAttendees(eventId: string | null) {
  const [data, setData] = useState<EventAttendee[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;
    setLoading(true);

    EventAttendeeService.getAll(eventId)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  return { data, loading, error };
}
