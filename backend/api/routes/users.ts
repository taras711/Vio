import { Router } from "express";
import type { UserQueryController } from "../../modules/users/UserQueryController";

export function createUserQueryRoutes(controller: UserQueryController) {
  const router = Router();

  router.get("/by-area/:areaId", controller.getByArea);
  router.get("/by-sector/:sectorId", controller.getBySector);
  router.get("/visible", controller.getVisible);
  router.get("/by-area-sector/:areaId/:sectorId", controller.getByAreaSector);
  router.get("/by-area-visibility/:areaId", controller.getByAreaVisibility);
  router.get("/by-area-sector-visibility/:areaId/:sectorId", controller.getByAreaSectorVisibility);

  return router;
}