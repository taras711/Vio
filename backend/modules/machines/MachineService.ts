import { randomUUID } from "crypto";
import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";
import type { CreateMachineDto, UpdateMachineDto, Machine } from "./MachineTypes";

export class MachineService {
  constructor(private db: DatabaseAdapter) {}

  async getAll(): Promise<Machine[]> {
    return this.db.find<Machine>("machines", {});
  }

  async getById(id: string): Promise<Machine | null> {
    return this.db.findOne<Machine>("machines", { id });
  }

  async create(dto: CreateMachineDto): Promise<Machine> {
    const machine: Machine = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      serialNumber: dto.serialNumber,
      location: dto.location,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.db.insert("machines", machine);
    return machine;
  }

  async update(id: string, dto: UpdateMachineDto): Promise<void> {
    await this.db.update("machines", id, {
      ...dto,
      updatedAt: new Date().toISOString()
    });
  }

  async delete(id: string): Promise<void> {
    await this.db.delete("machines", id);
  }
}