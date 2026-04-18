/**
 * @module core/db/migrate-runner
 * @description This file contains the database migration runner.
 */
import { createDatabaseAdapter } from "./createAdapter";
import { runMigrations } from "./migrate";

async function main() {
  const db = await createDatabaseAdapter({
    type: "sqlite",
    file: "./data.db"
  });

  await runMigrations(db);
}

main();