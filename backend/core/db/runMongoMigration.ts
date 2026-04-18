// backend/core/db/runMongoMigration.ts
import fs from "fs";
import path from "path";
import type { MongoAdapter } from "./mongo/MongoAdapter";

export async function runMongoMigrations(db: MongoAdapter, migrationsDir: string) {
  const collection = db["db"].collection("migrations");

  await collection.createIndex({ name: 1 }, { unique: true });

  const executed = await collection.find().toArray();
  const executedNames = new Set(executed.map(m => m.name));

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".js"))
    .sort();

  for (const file of files) {
    if (executedNames.has(file)) continue;

    const fullPath = path.join(migrationsDir, file);
    const migration = require(fullPath);

    console.log(`Running Mongo migration: ${file}`);

    await migration.up(db["db"]);

    await collection.insertOne({
      name: file,
      run_at: new Date()
    });
  }

  console.log("Mongo migrations completed.");
}