import type { Request, Response } from "express";
import type { SectorService } from "./SectorService";

export class SectorController {
  constructor(private sectorService: SectorService) {}

  async getAll(req: Request, res: Response) {
    try {
      const sectors = await this.sectorService.getAll();
      res.json(sectors);
    } catch (err) {
      res.status(500).json({ error: "Failed to load sectors" });
    }
  }

  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const sector = await this.sectorService.getById(req.params.id);
      if (!sector) return res.status(404).json({ error: "Sector not found" });
      res.json(sector);
    } catch (err) {
      res.status(500).json({ error: "Failed to load sector" });
    }
  }
}