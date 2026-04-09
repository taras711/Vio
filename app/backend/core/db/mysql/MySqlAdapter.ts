// db/mysql/MySqlAdapter.ts
import { DatabaseAdapter } from "../DatabaseAdapter";
import mysql from "mysql2/promise"; // npm install mysql2 @types/mysql2

export class MySqlAdapter implements DatabaseAdapter {
  private pool;
  readonly type = "mysql";

  constructor(config: any) {
    this.pool = mysql.createPool(config);
  }

    async raw(query: string, params: any[] = []): Promise<any> {
        const [rows] = await this.pool.query(query, params);
        return rows;
    }

  findById<T>(table: string, id: string): Promise<T | null> {
    return this.findOne<T>(table, { id });
  }

  findByEmail<T>(table: string, email: string): Promise<T | null> {
    return this.findOne<T>(table, { email });
  }

async find<T>(table: string, query: any): Promise<T[]> {
  let sql = `SELECT * FROM \`${table}\``;
  const params: any[] = [];

  if (query && Object.keys(query).length > 0) {
    const where = Object.keys(query)
      .map(key => `\`${key}\` = ?`)
      .join(" AND ");

    sql += ` WHERE ${where}`;
    params.push(...Object.values(query));
  }

  const [rows] = await this.pool.query(sql, params);
  return rows as T[];
}

async findOne<T>(table: string, query: any): Promise<T | null> {
  const rows = await this.find<T>(table, query);
  return rows[0] ?? null;
}

  async insert<T>(table: string, data: T): Promise<void> {
    await this.pool.query(
      `INSERT INTO \`${table}\` SET ?`,
      [data]
    );
  }

  async update<T>(table: string, query: any, data: Partial<T>): Promise<void> {
    await this.pool.query(
      `UPDATE \`${table}\` SET ? WHERE ?`,
      [data, query]
    );
  }

  async delete(table: string, query: any): Promise<void> {
    await this.pool.query(
      `DELETE FROM \`${table}\` WHERE ?`,
      [query]
    );
  }
}