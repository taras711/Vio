import type { Request, Response } from "express";
import type { MachineService } from "./MachineService";

export class MachineController {
  constructor(private machines: MachineService) {}

  getAll = async (req: Request, res: Response) => {
    res.json(await this.machines.getAll());
  };

  getById = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const machine = await this.machines.getById(id);
    if (!machine) return res.status(404).json({ error: "Not found" });
    res.json(machine);
  };

  create = async (req: Request, res: Response) => {
    const machine = await this.machines.create(req.body);
    res.json(machine);
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.machines.update(id, req.body);
    res.json({ ok: true });
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.machines.delete(id);
    res.json({ ok: true });
  };
}