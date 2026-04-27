/**
 * @module modules/timeline/timelineRoutes
 */

import { Router } from "express";
import type { TimelineController } from "./TimelineController";
import { createAuthenticateMiddleware } from "../../api/middleware/authenticate";

export function createTimelineRoutes(
  controller: TimelineController,
  auth: any,
  db: any,
  licenseService: any
) {
  const router = Router();
  const authenticate = createAuthenticateMiddleware(auth, db, licenseService);

  // GET /api/timeline?from=<ms>&to=<ms>
  router.get("/", authenticate, controller.getEvents);

  return router;
}