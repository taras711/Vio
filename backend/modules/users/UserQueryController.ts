import type { Request, Response } from "express";
import type { UserQueryService } from "./UserQueryService";

export class UserQueryController {
  constructor(private users: UserQueryService) {}

  getByArea = async (req: Request<{ areaId: string }>, res: Response) => {
    const users = await this.users.getByArea(req.params.areaId);
    res.json(users);
  };

  getBySector = async (req: Request<{ sectorId: string }>, res: Response) => {
    const users = await this.users.getBySector(req.params.sectorId);
    res.json(users);
  };

  getByAreaSector = async (req: Request<{ areaId: string; sectorId: string }>, res: Response) => {
    const users = await this.users.getByAreaSector(req.params.areaId, req.params.sectorId);
    console.log("BE received:", req.params, req.query, req.body);

    res.json(users);
  };

  getByAreaVisibility = async (req: Request<{ areaId: string }>, res: Response) => {
    const users = await this.users.getByAreaVisibility(req.params.areaId);
    res.json(users);
  }

  getByAreaSectorVisibility = async (req: Request<{ areaId: string; sectorId: string }>, res: Response) => {
    const users = await this.users.getByAreaSectorVisibility(req.params.areaId, req.params.sectorId);
    res.json(users);
  }

    getVisible = async (req: Request, res: Response) => {
    const areaId = req.auth?.areaId;

    // 🔥 Fallback: pokud user nemá areaId → vracíme ALL users
    if (!areaId) {
        const users = await this.users.getAll(); // musíš mít getAll() v UserQueryService
        return res.json(users);
    }

    // normální visible logika
    const users = await this.users.getVisibleForUser(areaId);
    res.json(users);
    };

}