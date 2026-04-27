/**
 * @module modules/timeline/TimelineController
 */

import type { Request, Response } from "express";
import type { TimelineService } from "./TimelineService";

export class TimelineController {
  constructor(private timeline: TimelineService) {}

  /**
   * GET /api/timeline?from=<ms>&to=<ms>
   *
   * Returns timeline events visible to the authenticated user.
   * Admins (wildcard permission) see ALL events.
   * Regular users see only events they are explicitly invited to.
   */
  getEvents = async (req: Request, res: Response) => {
    const from = Number(req.query.from);
    const to   = Number(req.query.to);

    if (!from || !to || isNaN(from) || isNaN(to)) {
      return res.status(400).json({ error: "Missing or invalid 'from' / 'to' query params (timestamps in ms)" });
    }

    if (to - from > 7 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ error: "Time window too large (max 7 days)" });
    }

    const auth = req.auth;
    if (!auth) return res.status(401).json({ error: "Not authenticated" });

    try {
      const isAdmin = auth.permissions.includes("*");

      const events = isAdmin
        ? await this.timeline.getAllEvents(from, to)
        : await this.timeline.getEventsForUser(auth.userId, from, to);

      return res.json(events);
    } catch (err: any) {
      console.error("[TimelineController] getEvents error:", err);
      return res.status(500).json({ error: "Failed to load timeline events" });
    }
  };
}