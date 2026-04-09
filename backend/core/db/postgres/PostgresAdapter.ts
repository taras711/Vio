import { Pool } from "pg"; // npm install pg @types/pg
import type { DatabaseAdapter } from "../DatabaseAdapter";

interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class PostgresAdapter implements DatabaseAdapter {
  private pool: Pool;
  readonly type = "postgres";

  constructor(config: DbConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database
    });
  }

  async find<T>(table: string, query: object): Promise<T[]> {
    const keys = Object.keys(query);
    const values = Object.values(query);

    const where = keys.map((k, i) => `"${k}" = $${i + 1}`).join(" AND ");

    const sql = `SELECT * FROM "${table}" WHERE ${where}`;
    const result = await this.pool.query(sql, values);

    return result.rows as T[];
  }

    async findOne<T>(table: string, query: object): Promise<T | null> {
        const rows = await this.find<T>(table, query);
        return rows[0] ?? null;
    }

    async insert<T>(table: string, data: T): Promise<void> {
        const obj = data as Record<string, any>;
        const keys = Object.keys(obj);
        const values = Object.values(obj);

        const cols = keys.map(k => `"${k}"`).join(", ");
        const params = keys.map((_, i) => `$${i + 1}`).join(", ");

        const sql = `INSERT INTO "${table}" (${cols}) VALUES (${params})`;

        await this.pool.query(sql, values);
    }

  async raw(sql: string, params: any[] = []): Promise<any> {
    return this.pool.query(sql, params);
    }

    async findById<T>(table: string, id: string): Promise<T | null> {
        const sql = `SELECT * FROM "${table}" WHERE "id" = $1`;
        const result = await this.pool.query(sql, [id]);
        return result.rows[0] ?? null;
    }

    async findByEmail<T>(table: string, email: string): Promise<T | null> {
        const sql = `SELECT * FROM "${table}" WHERE "email" = $1`;
        const result = await this.pool.query(sql, [email]);
        return result.rows[0] ?? null;
    }

    async update<T>(table: string, id: string, data: Partial<T>): Promise<void> {
        const obj = data as Record<string, any>;
        const keys = Object.keys(obj);
        const values = Object.values(obj);

        const set = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");

        const sql = `UPDATE "${table}" SET ${set} WHERE "id" = $${keys.length + 1}`;

        await this.pool.query(sql, [...values, id]);
    }

  async delete(table: string, id: string): Promise<void> {
    const sql = `DELETE FROM "${table}" WHERE "id" = $1`;
    await this.pool.query(sql, [id]);
  }
}