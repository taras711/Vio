
// backend/setup/SetupService.ts
import fs from "fs";
import bcrypt from "bcryptjs";

import type { DatabaseAdapter } from "../core/db/DatabaseAdapter";

import path from "path";
import { createDatabaseAdapter, DbConfig } from "../core/db/createAdapter";
import { runMigrations } from "../core/db/migrate";
import { decodeBase58ToJson, decodeHumanReadableKey } from "../core/license/licenseKey";


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
  private configPath = path.resolve(__dirname, "../config/server.json");

  constructor(private db: DatabaseAdapter | null) {}
public onConfigured?: () => void;

  isConfigured(): boolean {
    if (!fs.existsSync(this.configPath)) return false;
    console.log("Looking for config at:", this.configPath);
console.log("Exists:", fs.existsSync(this.configPath));
    try {
      const config = JSON.parse(fs.readFileSync(this.configPath, "utf8"));
      return config.setup?.isConfigured === true;
    } catch {
      return false;
    }
  }

  async runSetup(payload: SetupPayload) {
            console.log(">>> runSetup CALLED");
    if (this.isConfigured()) {
      throw new Error("Setup already completed");
    }

    if (!payload.email || !payload.password) {
      throw new Error("Missing admin credentials");
    }

    if (!payload.database?.type) {
      throw new Error("Missing database configuration");
    }

    if (!payload.licenseKey) {
      throw new Error("Missing license key");
    }



    // 2) Uložit server.json (zatím isConfigured = false)
    this.updateConfig(payload.database);

    // 3) Vytvořit DB adapter podle FE konfigurace
this.db = await createDatabaseAdapter(normalizeDbConfig(payload.database));

    // 4) Spustit migrace
    await runMigrations(this.db);


    // 5) Vytvořit superadmina
    await this.createSuperAdmin(payload.email, payload.password, payload.name);
console.log(">>> runSetup FINISHED, isConfigured = true");

if (this.onConfigured) {
  console.log(">>> CALLING onConfigured()");

            this.onConfigured();
        }else {
            console.log(">>> onConfigured NOT SET");

        }
    // 6) Označit setup jako dokončený
    this.lockSetup();

  }

private updateConfig(dbConfig: any) {
  const config = JSON.parse(fs.readFileSync(this.configPath, "utf8"));

  config.database = normalizeDbConfig(dbConfig);
  config.setup = { isConfigured: false };

  fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
}

  private async createSuperAdmin(email: string, password: string, name: string = "Super Admin") {
    if (!this.db) throw new Error("Database not initialized");
    const now = Date.now(); // ms
    const hash = await bcrypt.hash(password, 12);

  await this.db.insert("users", {
    email,
    name,
    passwordHash: hash,
    role: "superAdmin",
    permissions: JSON.stringify(["*"]),
    createdAt: now,
    updatedAt: now,
    isActive: 1,
    mfaEnabled: 0
  });

  }

  private lockSetup() {
    const config = JSON.parse(fs.readFileSync(this.configPath, "utf8"));
    config.setup.isConfigured = true;
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }

private saveLicense(key: string) {
  const json = decodeBase58ToJson(key);
  const obj = JSON.parse(json);

  const licensePath = path.resolve(__dirname, "../config/license.json");
  console.log("JSON FROM LICENSE:", json);

  fs.writeFileSync(licensePath, JSON.stringify(obj, null, 2));
}
}

function normalizeDbConfig(input: any): DbConfig {
  return input as DbConfig;
}