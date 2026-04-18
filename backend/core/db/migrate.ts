/**
 * Runs database migrations
 * @module core/db/migrate
 * @description This file contains the database migration runner.
 */
import fs from "fs";
import path from "path";
import type { DatabaseAdapter } from "./DatabaseAdapter";

/**
 * Runs database migrations for the given database adapter.
 * This function will load migrations from the migrations directory
 * specific to the database type and run them in alphabetical order.
 * Migration files must end with .sql and contain valid SQL.
 * The migrations table will be created if it does not exist.
 * Executed migrations will be saved to the migrations table.
 * @param db - The database adapter to run migrations for.
 * @returns A promise that resolves when all migrations have been run.
 */
export async function runMigrations(db: DatabaseAdapter) {
  if (db.type === "mongo") return;

  const migrationsDir = path.join(__dirname, "migrations", db.type);
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql")) // only .sql
    .sort(); // sort alphabetically

  await ensureMigrationsTable(db); // ensure migrations table

  // Verify migrations table
  if (db.type === "sqlite") {
    console.log("PRAGMA after ensureMigrationsTable:");
    console.log(await db.raw("PRAGMA table_info(migrations);"));
  }

  const executed = await loadExecutedMigrations(db); // load executed migrations

  // Run migrations
  for (const file of files) {
    if (executed.has(file)) continue;

    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, "utf8");

    if (db.type === "sqlite") {
      const statements = sql
        .split(";")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const stmt of statements) {
        console.log("RUNNING SQLITE MIGRATION STMT:", stmt);
        await db.raw(stmt);
      }
      
    } else {
      console.log("RUNNING MIGRATION FILE:", file);
      await db.raw(sql);
    }

    const cleanName = file
    .trim()
    .replace(/\uFEFF/g, "") // remove BOM
    .replace(/\0/g, "");    // remove null chars

    console.log("FILE NAME RAW:", file.split("").map(c => c.charCodeAt(0)));
    await saveMigrationRecord(db, cleanName);
  }
}

// ---------------------------------------------------------
// HELPERS
// ---------------------------------------------------------

/**
 * Ensures that the migrations table exists in the database.
 * If the table does not exist, it is created. If the table already exists, no action is taken.
 * The table schema is database type specific.
 * @param db - The database adapter to use.
 */
async function ensureMigrationsTable(db: DatabaseAdapter) {
  switch (db.type) {
    case "mysql":
      await db.raw(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL UNIQUE,
          run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        );
      `);
      break;

    case "postgres":
      await db.raw(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      break;

    case "sqlite":
      await db.raw(`
        CREATE TABLE IF NOT EXISTS migrations (
          name TEXT PRIMARY KEY,
          run_at TEXT NOT NULL
        );
      `);
      break;

    case "firebird":
      await db.raw(`
        CREATE TABLE migrations (
          id INTEGER NOT NULL,
          name VARCHAR(255) NOT NULL,
          run_at TIMESTAMP NOT NULL,
          PRIMARY KEY (id)
        );
      `);
      await db.raw(`CREATE SEQUENCE migrations_seq;`);
      await db.raw(`
        SET TERM !! ;
        CREATE TRIGGER migrations_bi FOR migrations
        ACTIVE BEFORE INSERT POSITION 0
        AS
        BEGIN
          IF (NEW.id IS NULL) THEN
            NEW.id = NEXT VALUE FOR migrations_seq;
        END!!
        SET TERM ; !!
      `);
      break;
  }
}

/**
 * Loads the executed migrations from the database.
 * 
 * @param db - The database adapter.
 * 
 * @returns A promise that resolves to a set of executed migration names.
 */
async function loadExecutedMigrations(db: DatabaseAdapter): Promise<Set<string>> {
  switch (db.type) {
    case "mysql":
    case "postgres":
    case "sqlite": {
      const rows = await db.raw(`SELECT name FROM migrations`);
      return new Set(rows.map((r: any) => r.name));
    }

    case "firebird": {
      const rows = await db.raw(`SELECT name FROM migrations`);
      return new Set(rows.map((r: any) => r.NAME));
    }

    default:
      return new Set();
  }
}

/**
 * Saves a migration record to the database.
 * @param db - The database adapter to use.
 * @param name - The name of the migration to save.
 * @returns A promise that resolves when the migration record is saved.
 */
async function saveMigrationRecord(db: DatabaseAdapter, name: string) {
  const now = new Date();

  switch (db.type) {
    case "mysql":
    case "postgres":
      await db.raw(
        `INSERT INTO migrations (name, run_at) VALUES (?, ?)`,
        [name, now]
      );
      break;

    case "sqlite":
      await db.raw(
        `INSERT INTO migrations (name, run_at) VALUES (?, ?)`,
        [name, now.toISOString()]
      );
      break;

    case "firebird":
      await db.raw(
        `INSERT INTO migrations (name, run_at) VALUES (?, ?)`,
        [name, now]
      );
      break;
  }
}
