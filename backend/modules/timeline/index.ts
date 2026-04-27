/**
 * @module modules/timeline
 */

import { TimelineService }    from "./TimelineService";
import { TimelineController } from "./TimelineController";
import { createTimelineRoutes } from "./timelineRoutes";

export function createTimelineModule(deps: any) {
  const service    = new TimelineService(deps.db);
  const controller = new TimelineController(service);
  const routes     = createTimelineRoutes(controller, deps.auth, deps.db, deps.license);

  return {
    name: "timeline",
    routes,
    init() {
      console.log("Timeline module initialized");
    },
  };
}