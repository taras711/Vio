import type { Request, Response } from "express";
import type { LocationService } from "./LocationService";

export class LocationController {
  constructor(private locationService: LocationService) {}

  async getAll(req: Request, res: Response) {
    try {
      const locations = await this.locationService.getAll();
      res.json(locations);
    } catch (err) {
      res.status(500).json({ error: "Failed to load locations" });
    }
  }

  async getByAreaSector(req: Request<{ areaId: string, sectorId: string }>, res: Response) {
  try {
    const { areaId, sectorId } = req.params;
    const locations = await this.locationService.getByAreaSector(areaId, sectorId);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Failed to load locations" });
  }
}

getByAreaVisibility = async (req: Request<{ areaId: string }>, res: Response) => {
  try {
    const locations = await this.locationService.getByAreaVisibility(req.params.areaId);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Failed to load locations" });
  }
}

getByAreaSectorVisibility = async (req: Request<{ areaId: string; sectorId: string }>, res: Response) => {
  try {
    const locations = await this.locationService.getByAreaSectorVisibility(req.params.areaId, req.params.sectorId);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Failed to load locations" });
  }
}

  async getByArea(req: Request<{ areaId: string }>, res: Response) {
    try {
      const locations = await this.locationService.getByArea(req.params.areaId);
      res.json(locations);
    } catch (err) {
      res.status(500).json({ error: "Failed to load locations" });
    }
  }

  async getBySector(req: Request<{ sectorId: string }>, res: Response) {
    try {
      const locations = await this.locationService.getBySector(req.params.sectorId);
      res.json(locations);
    } catch (err) {
      res.status(500).json({ error: "Failed to load locations" });
    }
  }
async getVisible(req: Request, res: Response) {
  try {
    const user = req.auth;

    // 🔥 Fallback: pokud user nemá areaId → vracíme ALL locations
    if (!user?.areaId) {
      const locations = await this.locationService.getAll();
      return res.json(locations);
    }

    // normální visible logika
    const locations = await this.locationService.getVisibleForUser(user.areaId);
    res.json(locations);

  } catch (err) {
    console.error("Error in getVisible:", err);
    res.status(500).json({ error: "Failed to load visible locations" });
  }
}


}