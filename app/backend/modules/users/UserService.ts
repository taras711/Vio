// backend/modules/users/UserService.ts
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";
import type { LicenseService } from "../../core/license/LicenseService";
import type { CreateUserDto, UpdateUserDto, User } from "./UserTypes";

export class UserService {
  constructor(
    private db: DatabaseAdapter,
    private license: LicenseService
  ) {}

  async getAll(): Promise<User[]> {
    return this.db.find<User>("users", {});
  }

  async getById(id: string): Promise<User | null> {
    return this.db.findOne<User>("users", { id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.db.findOne<User>("users", { email });
  }

  // ✔ přidáme alias, aby fungovalo userService.findById()
  async findById(id: string): Promise<User | null> {
    return this.getById(id);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const licenseData = this.license.getLicense();

    const users = await this.getAll();
    if (users.length >= licenseData.maxUsers) {
      throw new Error("User limit reached (license restriction)");
    }

    const id = randomUUID();
    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user: User = {
      id,
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: dto.role,
      permissions: dto.permissions,
      isActive: true
    };

    await this.db.insert("users", user);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<void> {
    const updateData: any = { ...dto };

    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 12);
      delete updateData.password;
    }

    await this.db.update("users", id, updateData);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete("users", id);
  }
}