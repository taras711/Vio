import fs from "fs";
import path from "path";

export type PostgresConfig = {
  type: "postgres";
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type MySqlConfig = {
  type: "mysql";
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type MongoConfig = {
  type: "mongo";
  url: string;
  database: string;
};

export type FirebirdConfig = {
  type: "firebird";
  fbPath: string;
  fbUser: string;
  fbPassword: string;
};

export type SqliteConfig = {
  type: "sqlite";
  file: string;
};

export type DbConfig =
  | PostgresConfig
  | MySqlConfig
  | MongoConfig
  | FirebirdConfig
  | SqliteConfig;

export function loadDbConfig(): DbConfig {
  const configPath = path.resolve(__dirname, "../../../config/server.json");

  // 1) Pokud existuje server.json → použij ho
  if (fs.existsSync(configPath)) {
    const json = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (json.database) {
      return json.database as DbConfig;
    }
  }

  console.log("CWD:", process.cwd());
console.log("DIRNAME:", __dirname);
console.log("CONFIG PATH:", configPath);
console.log("CONFIG EXISTS:", fs.existsSync(configPath));


  // 2) Fallback pro vývojáře (ty)
  const type = process.env.DB_TYPE;

  switch (type) {
    case "postgres":
      return {
        type: "postgres",
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT!),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
      };

    case "mysql":
      return {
        type: "mysql",
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT!),
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
      };

    case "mongo":
      return {
        type: "mongo",
        url: process.env.DB_MONGO_URL!,
        database: process.env.DB_NAME!,
      };

    case "firebird":
      return {
        type: "firebird",
        fbPath: process.env.DB_FIREBIRD_PATH!,
        fbUser: process.env.DB_FIREBIRD_USER!,
        fbPassword: process.env.DB_FIREBIRD_PASSWORD!,
      };

    case "sqlite":
      return {
        type: "sqlite",
        file: process.env.DB_SQLITE_FILE!,
      };

    default:
      throw new Error(`Unknown DB_TYPE: ${type}`);
  }
}
