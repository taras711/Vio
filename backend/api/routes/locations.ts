import { Router } from "express";
import type { LocationController } from "../../modules/locations/LocationController";

export function createLocationRoutes(controller: LocationController) {
  const router = Router();

  router.get("/all", (req, res) => controller.getAll(req, res));
  router.get("/by-area/:areaId", (req, res) => controller.getByArea(req, res));
  router.get("/by-sector/:sectorId", (req, res) => controller.getBySector(req, res));
  router.get("/visible", (req, res) => controller.getVisible(req, res));
  router.get("/by-area-sector/:areaId/:sectorId", (req, res) => controller.getByAreaSector(req, res));

  return router;
}