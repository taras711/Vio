
/**
 * @module setup/SetupService
 * @description This module contains the service for the setup module.
 */
import fs from "fs";
import bcrypt from "bcryptjs";
import type { DatabaseAdapter } from "../core/db/DatabaseAdapter";
import path from "path";
import { DbConfig } from "../core/db/config/Database";
import { createDatabaseAdapter } from "../core/db/createAdapter";
import { runMigrations } from "../core/db/migrate";
import { decodeBase58ToJson, decodeHumanReadableKey } from "../core/license/licenseKey";
import { TABLES } from "../core/db/schema/tables";

// Configurations
interface SetupPayload {
  email: string;
  name?: string;
  password: string;
  licenseKey: string;
  database: {
    type: string;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
}

export class SetupService {

  // Load config from file
  private configPath = path.resolve(__dirname, "../config/server.json");

  constructor(private db: DatabaseAdapter | null) {}

  // Callback
  public onConfigured?: () => void;

  /**
   * Checks if the setup process has been completed.
   * @returns - True if setup has been completed, false otherwise.
   */
  isConfigured(): boolean {
    if (!fs.existsSync(this.configPath)) return false;
    try {
      // Load config from file
      const config = JSON.parse(fs.readFileSync(this.configPath, "utf8"));
      return config.setup?.isConfigured === true;
    } catch {
      return false;
    }
  }

  /**
   * Runs the setup process of the server.
   * 
   * This function will configure the server by:
   * 1. Validating the license key.
   * 2. Updating the server configuration.
   * 3. Creating a database adapter.
   * 4. Running database migrations.
   * 5. Creating a superadmin user.
   * 6. Locking the setup process as completed.
   * 
   * If the setup process has already been completed, this function will throw an error.
   * 
   * @param payload - The payload to setup the server.
   * @throws - If the setup process has already been completed.
   */
  async runSetup(payload: SetupPayload) {

    // Check if the setup process has already been completed
    if (this.isConfigured()) {
      throw new Error("Setup already completed");
    }

    // Check if payload is valid
    if (!payload.email || !payload.password) {
      throw new Error("Missing admin credentials");
    }

    // Check if payload for database is valid
    if (!payload.database?.type) {
      throw new Error("Missing database configuration");
    }

    // Check if payload for license key is valid
    if (!payload.licenseKey) {
      throw new Error("Missing license key");
    }

    // Save license key
    this.updateConfig(payload.database);

    // Create database adapter
    this.db = await createDatabaseAdapter(normalizeDbConfig(payload.database));

    // Run migrations
    await runMigrations(this.db);


    // Create superadmin
    await this.createsuperadmin(payload.email, payload.password, payload.name);

    // Call onConfigured callback
    if (this.onConfigured) {
        this.onConfigured();
    }else {
        console.log(">>> onConfigured NOT SET");
    }

    // Lock setup
    this.lockSetup();
  }

  /**
   * Updates the configuration file with the given database configuration.
   * @param dbConfig - The database configuration to update the configuration file with.
   */
  private updateConfig(dbConfig: any) {
    const config = JSON.parse(fs.readFileSync(this.configPath, "utf8"));

    config.database = normalizeDbConfig(dbConfig); // Normalize database configuration
    config.setup = { isConfigured: false }; // Reset setup

    // Save config
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Creates a superadmin user with the given email, password and name.
   * @param email - The email of the superadmin user.
   * @param password - The password of the superadmin user.
   * @param name - The name of the superadmin user. Defaults to "Super Admin".
   * @throws - If the database is not initialized.
   */
  private async createsuperadmin(email: string, password: string, name: string = "Super Admin") {
    if (!this.db) throw new Error("Database not initialized");
    
    const now = Date.now(); // ms
    const hash = await bcrypt.hash(password, 12);

    // Create superadmin user
    await this.db.insert(TABLES.users, {
      email,
      name,
      passwordHash: hash,
      role: "superadmin",
      permissions: JSON.stringify(["*"]),
      createdAt: now,
      updatedAt: now,
      isActive: 1,
      mfaEnabled: 0
    });

  }

  /**
   * Locks the setup process by setting the "isConfigured" flag to true in the configuration file.
   * This prevents the setup process from being executed again.
   */
  private lockSetup() {
    const config = JSON.parse(fs.readFileSync(this.configPath, "utf8"));
    config.setup.isConfigured = true;
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }
}

/**
 * Normalizes the given database configuration object into a DbConfig object.
 * This function assumes that the given input object is already a valid DbConfig object.
 * If the input object is not a valid DbConfig object, this function will throw an error.
 * @param input - The database configuration object to normalize.
 * @returns - The normalized database configuration object.
 * @throws - If the input object is not a valid DbConfig object.
 */
function normalizeDbConfig(input: any): DbConfig {
  return input as DbConfig;
}