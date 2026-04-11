// backend/modules/users/UserController.ts
import type { Request, Response } from "express";
import type { UserService } from "./UserService";
import { CreateUserSchema } from "../../schemas/user.schema"; // nahoře

export class UserController {
  constructor(private users: UserService) {}

  getAll = async (req: Request, res: Response) => {
    res.json(await this.users.getAll());
  };

    getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const user = await this.users.getById(id);
        if (!user) return res.status(404).json({ error: "Not found" });

        res.json(user);
    };

  create = async (req: Request, res: Response) => {
    const parsed = CreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten()
      });
    }

    const dto = parsed.data;

    try {
      const user = await this.users.create(dto);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await this.users.update(id, req.body);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.users.delete(id);
    res.json({ ok: true });
  };
}