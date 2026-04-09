db.createCollection("migrations");

db.migrations.createIndex(
  { name: 1 },
  { unique: true }
);