/**
 * @module modules/users/UserService
 * @description This module contains the service for the users module.
 */
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";
import type { LicenseService } from "../../core/license/LicenseService";
import type { CreateUserDto, UpdateUserDto, User } from "./UserTypes";
import { TABLES } from "../../core/db/schema/tables";

export class UserService {
  constructor(
    private db: DatabaseAdapter,
    private license: LicenseService
  ) {}

  /**
   * Gets all users from the database.
   * @param page - The page of users to get. Defaults to 1.
   * @param limit - The number of users to get per page. Defaults to 50.
   * @returns A promise that resolves with an array of users.
   */
  async getAll(page = 1, limit = 50): Promise<User[]> {
    const offset = (page - 1) * limit;
    const rows = await this.db.find<User>(TABLES.users, {}, { limit, offset });
    return rows.map(mapUser);
  }


  /**
   * Finds a user by id.
   * Returns the user if found, or null if not found.
   * @param id - The id of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  async getById(id: string): Promise<User | null> {
    const user = await this.db.findOne<User>(TABLES.users, { id });
    return user ? mapUser(user) : null;
  }

  /**
   * Finds a user by email.
   * Returns the user if found, or null if not found.
   * @param email - The email of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.findOne<User>(TABLES.users, { email });
    return user ? mapUser(user) : null;
  }
  
  /**
   * Finds a user by id.
   * Returns the user if found, or null if not found.
   * @param id - The id of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  async findById(id: string): Promise<User | null> {
    return this.getById(id);
  }

  /**
   * Creates a new user.
   * Checks if the license has reached its maximum allowed users.
   * If the license has reached its maximum allowed users, throws an error.
   * @param dto - The data to create the user with.
   * @returns A promise that resolves with the created user.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const licenseData = this.license.getLicense();

    const users = await this.getAll();

    // Check if the license has reached its maximum allowed users
    if (users.length >= licenseData.maxUsers) {
      throw new Error("User limit reached (license restriction)");
    }

    const id = randomUUID(); // Generate a random UUID
    const passwordHash = await bcrypt.hash(dto.password, 12); // Hash the password

    const user: User = {
      id,
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: dto.role,
      permissions: dto.permissions,
      isActive: true
    };

    await this.db.insert(TABLES.users, user);
    return user;
  }

  /**
   * Updates a user.
   * If the update object contains a password, it is hashed and the original password is removed.
   * @param id - The id of the user to update.
   * @param dto - The data to update the user with.
   * @returns A promise that resolves when the user has been updated.
   */
  async update(id: string, dto: UpdateUserDto): Promise<void> {
    const updateData: any = { ...dto }; // Create a copy of the update object

    // If the update object contains a password, hash it
    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 12);
      delete updateData.password; // Remove the password from the update object
    }

    await this.db.update(TABLES.users, { id }, updateData);
  }

  /**
   * Deletes a user by its id.
   * @param id - The id of the user to delete.
   * @returns A promise that resolves when the user has been deleted.
   */
  async delete(id: string): Promise<void> {
    await this.db.delete(TABLES.users, { id });
  }

  /**
   * Deactivates a user.
   * Sets the isActive field to false and the lastDeactivatedAt field to the current timestamp.
   * @param id - The id of the user to deactivate.
   * @returns A promise that resolves when the user has been deactivated.
   */
  async deactivateUser(id: number): Promise<void> {
    const now = Date.now();
    await this.db.update(TABLES.users, { id }, { isActive: false, lastDeactivatedAt: now });
  }

  /**
   * Activates a user.
   * Sets the isActive field to true and the lastDeactivatedAt field to null.
   * @param id - The id of the user to activate.
   * @returns A promise that resolves when the user has been activated.
   */
  async activateUser(id: number): Promise<void> {
    await this.db.update(TABLES.users, { id }, { isActive: true, lastDeactivatedAt: null });
  }

}

// ------------------ Helper functions ------------------
/**
 * Maps a user object from the database to a User object.
 * @param u - The user object from the database.
 * @returns A User object with the permissions field parsed from a JSON string.
 */
function mapUser(u: any): User {
  return {
    ...u,
    permissions: JSON.parse(u.permissions || "[]")
  };
}