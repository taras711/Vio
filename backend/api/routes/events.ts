import { Router } from "express";
import { EventController } from "../../modules/events/event.controller";

export function createEventRoutes(controller: EventController) {
  const router = Router();

  router.post("/", (req, res) => controller.create(req, res));
  router.get("/", (req, res) => controller.getAll(req, res));
    // details
  router.get("/:id/detail", (req, res) => controller.getDetail(req, res));
  router.get("/:id", (req, res) => controller.getById(req, res));
  router.put("/:id", (req, res) => controller.update(req, res));
  router.delete("/:id", (req, res) => controller.delete(req, res));

  // reactions
  router.post("/:id/feedback/:feedbackId/reaction", (req, res) => controller.toggleReaction(req, res));

  // feedback
  router.post("/:id/feedback", (req, res) => controller.addFeedback(req, res));
  router.delete("/:id/feedback/:feedbackId", (req, res) => controller.deleteMessage(req, res));

  // attendees
  router.get("/:id/attendees", (req, res) => controller.getAttendees(req, res));
  router.post("/:id/attendees", (req, res) => controller.addAttendee(req, res));
  router.delete("/:id/attendees", (req, res) => controller.deleteAllAttendees(req, res));

  router.put("/:id/attendees/:attendeeId", (req, res) =>
    controller.updateAttendee(req, res)
  );
  router.delete("/:id/attendees/:attendeeId", (req, res) =>
    controller.deleteAttendee(req, res)
  );

  return router;
}

