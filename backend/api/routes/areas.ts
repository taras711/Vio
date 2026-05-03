// backend/api/routes/areas.ts
import { Router } from "express";
import type { AreaController } from "../../modules/areas/AreaController";

export function createAreaRoutes(areaController: AreaController) {
  const router = Router();

  router.get("/", (req, res) => areaController.getAll(req, res));
  router.get("/:id", (req, res) => areaController.getById(req, res));

  return router;
}