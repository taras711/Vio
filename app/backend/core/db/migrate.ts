import fs from "fs";
import path from "path";
import type { DatabaseAdapter } from "./DatabaseAdapter";

export async function runMigrations(db: DatabaseAdapter) {
  if (db.type === "mongo") return;

  const migrationsDir = path.join(__dirname, "migrations", db.type);
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  await ensureMigrationsTable(db);

  // DEBUG: ověř, že tabulka existuje a jak vypadá
  if (db.type === "sqlite") {
    console.log("PRAGMA after ensureMigrationsTable:");
    console.log(await db.raw("PRAGMA table_info(migrations);"));
  }

  const executed = await loadExecutedMigrations(db);

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
      // idempotentně – pokud už existuje, Firebird hodí chybu, ale to můžeme později ošetřit
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
