import { Router } from "express";
import type { SectorController } from "../../modules/sectors/SectorController";

export function createSectorRoutes(controller: SectorController) {
  const router = Router();

  router.get("/", (req, res) => controller.getAll(req, res));
  router.get("/:id", (req, res) => controller.getById(req, res));

  return router;
}