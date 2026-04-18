/**
 * @module core/users
 * @description This file contains the controller for the users module.
 */
import type { Request, Response } from "express";
import type { UserService } from "./UserService";
import { CreateUserSchema } from "../../schemas/user.schema"; // nahoře

export class UserController {
  constructor(private users: UserService) {}

  // Get all users with pagination
  getAll = async (req: Request, res: Response) => {
    res.json(await this.users.getAll());
  };

  // Get user by id
  getById = async (req: Request, res: Response) => {
      const id = req.params.id as string;

      const user = await this.users.getById(id);
      if (!user) return res.status(404).json({ error: "Not found" });

      res.json(user);
  };

  // Create user
  create = async (req: Request, res: Response) => {
    const parsed = CreateUserSchema.safeParse(req.body);

    // Validate input data
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsed.error.flatten()
      });
    }

    const dto = parsed.data; // get the validated data

    try {
      const user = await this.users.create(dto);
      res.json(user);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // Update user
  update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      await this.users.update(id, req.body);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  // Delete user
  delete = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await this.users.delete(id);
    res.json({ ok: true });
  };
}