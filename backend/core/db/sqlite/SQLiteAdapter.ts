import Database from "better-sqlite3";
import type { DatabaseAdapter } from "../DatabaseAdapter";

export class SQLiteAdapter implements DatabaseAdapter {
  private db: Database.Database;
  readonly type = "sqlite";

  constructor(filePath: string) {
    this.db = new Database(filePath);
  }

async raw(query: string, params: any[] = []): Promise<any> {
  const stmt = this.db.prepare(query);
  const upper = query.trim().toUpperCase();

  // SELECT dotazy
  if (upper.startsWith("SELECT")) {
    return params.length > 0 ? stmt.all(...params) : stmt.all();
  }

  // PRAGMA dotazy — vždy vrací pole řádků
  if (upper.startsWith("PRAGMA")) {
    return stmt.all();
  }

  // INSERT / UPDATE / DELETE / CREATE TABLE / ALTER TABLE / DROP
  return params.length > 0 ? stmt.run(...params) : stmt.run();
}

  async find<T>(table: string, query: any): Promise<T[]> {
    const keys = Object.keys(query);
    const where = keys.map(k => `${k} = ?`).join(" AND ");
    const values = Object.values(query);

    const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE ${where}`);
    const rows = stmt.all(...values);

    return rows as unknown as T[];
  }

  async findOne<T>(table: string, query: any): Promise<T | null> {
    const keys = Object.keys(query);
    const where = keys.map(k => `${k} = ?`).join(" AND ");
    const values = Object.values(query);

    const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE ${where}`);
    const row = stmt.get(...values);

    return (row as unknown as T) ?? null;
  }

  async insert<T>(table: string, data: T): Promise<void> {
    const obj = data as any;
    const keys = Object.keys(obj);
    const values = keys.map(k => this.normalizeValue(obj[k]));

    const placeholders = keys.map(() => "?").join(",");

    const stmt = this.db.prepare(
      `INSERT INTO ${table} (${keys.join(",")}) VALUES (${placeholders})`
    );

    stmt.run(...values);
  }

async update<T>(table: string, query: any, data: Partial<T>): Promise<void> {
  const obj = data as any;

  const setKeys = Object.keys(obj);
  const whereKeys = Object.keys(query);

  const set = setKeys.map(k => `${k} = ?`).join(",");
  const where = whereKeys.map(k => `${k} = ?`).join(" AND ");

  const values = [
    ...setKeys.map(k => this.normalizeValue(obj[k])),
    ...whereKeys.map(k => this.normalizeValue(query[k]))
  ];

  const stmt = this.db.prepare(
    `UPDATE ${table} SET ${set} WHERE ${where}`
  );

  stmt.run(...values);
}

findById<T>(table: string, id: string): Promise<T | null> {
  const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE id = ?`);
  const row = stmt.get(id);
  return Promise.resolve((row as unknown as T) ?? null);
}

findByEmail<T>(table: string, email: string): Promise<T | null> {
  const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE email = ?`);
  const row = stmt.get(email);
  return Promise.resolve((row as unknown as T) ?? null);
}

async delete(table: string, query: any): Promise<void> {
  const keys = Object.keys(query);
  const where = keys.map(k => `${k} = ?`).join(" AND ");
  const values = keys.map(k => this.normalizeValue(query[k]));

  const stmt = this.db.prepare(
    `DELETE FROM ${table} WHERE ${where}`
  );

  stmt.run(...values);
}

  private normalizeValue(value: any) {
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }
    if (value === undefined) {
      return null;
    }
    return value;
  }
}