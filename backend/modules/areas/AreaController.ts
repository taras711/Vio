import type { Request, Response } from "express";
import type { AreaService } from "./AreaService";

export class AreaController {
  constructor(private areaService: AreaService) {}

  // GET /api/areas
  async getAll(req: Request, res: Response) {
    try {
      const areas = await this.areaService.getAll();
      res.json(areas);
    } catch (err) {
      console.error("Error in getAll:", err);
      res.status(500).json({ error: "Failed to load areas" });
    }
  }

  // GET /api/areas/:id
  async getById(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      const area = await this.areaService.getById(id);

      if (!area) {
        return res.status(404).json({ error: "Area not found" });
      }

      res.json(area);
    } catch (err) {
      console.error("Error in getById:", err);
      res.status(500).json({ error: "Failed to load area" });
    }
  }
}