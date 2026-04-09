// core/db/createAdapter.ts
import type { DatabaseAdapter } from "./DatabaseAdapter";
import { PostgresAdapter } from "./postgres/PostgresAdapter";
import { MySqlAdapter } from "./mysql/MySqlAdapter";
import { MongoAdapter } from "./mongo/MongoAdapter";
import { FirebirdAdapter } from "./firebird/FirebirdAdapter";
import { SQLiteAdapter } from "./sqlite/SQLiteAdapter";

export interface DbConfig {
    type: "postgres" | "mysql" | "mongo" | "firebird" | "sqlite";
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    file?: string; // for SQLite
    url?: string;
}

export async function createDatabaseAdapter(config: DbConfig): Promise<DatabaseAdapter> {
  switch (config.type) {
    case "postgres":
      return new PostgresAdapter({
        host: config.host!,
        port: config.port!,
        user: config.user!,
        password: config.password!,
        database: config.database!
      });

    case "mysql":
      return new MySqlAdapter(config);

    case "mongo":
      return new MongoAdapter(config.url!, config.database!);

    case "firebird":
      return new FirebirdAdapter(config);

    case "sqlite":
      return new SQLiteAdapter(config.file!);

    default:
      throw new Error(`Unknown database type: ${config.type}`);
  }
}