// core/db/createAdapter.ts
import type { DatabaseAdapter } from "./DatabaseAdapter";
import type { DbConfig } from "./config/Database";
import { PostgresAdapter } from "./postgres/PostgresAdapter";
import { MySqlAdapter } from "./mysql/MySqlAdapter";
import { MongoAdapter } from "./mongo/MongoAdapter";
import { FirebirdAdapter } from "./firebird/FirebirdAdapter";
import { SQLiteAdapter } from "./sqlite/SQLiteAdapter";
import dotenv from "dotenv";
dotenv.config();

export async function createDatabaseAdapter(config: DbConfig) {
  switch (config.type) {
    case "postgres":
      return new PostgresAdapter(config);

    case "mysql":
      return new MySqlAdapter(config);

    case "mongo":
      return new MongoAdapter(config.url, config.database);

    case "firebird":
      return new FirebirdAdapter(config);

    case "sqlite":
      return new SQLiteAdapter(config.file);

    default:
      throw new Error("Unsupported DB type");
  }
}


