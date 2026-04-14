// db/mysql/MySqlAdapter.ts
import { DatabaseAdapter } from "../DatabaseAdapter";
import mysql from "mysql2/promise"; // npm install mysql2 @types/mysql2

export class MySqlAdapter implements DatabaseAdapter {
  private pool;
  readonly type = "mysql";

  constructor(config: any) {
    this.pool = mysql.createPool(config);
  }

  async ping(): Promise<void> {
    await this.pool.query("SELECT 1");
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

async insert<T extends Record<string, any>>(table: string, data: T): Promise<void> {
  const keys = Object.keys(data);
  const values = Object.values(data);

  const columns = keys.map(k => `\`${k}\``).join(", ");
  const placeholders = keys.map(() => "?").join(", ");

  const sql = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;

  await this.pool.query(sql, values);
}



async update<T extends Record<string, any>>(
  table: string,
  query: Record<string, any>,
  data: Partial<T>
): Promise<void> {
  const setKeys = Object.keys(data);
  const setValues = Object.values(data);

  const whereKeys = Object.keys(query);
  const whereValues = Object.values(query);

  const setSql = setKeys.map(k => `\`${k}\` = ?`).join(", ");
  const whereSql = whereKeys.map(k => `\`${k}\` = ?`).join(" AND ");

  const sql = `UPDATE \`${table}\` SET ${setSql} WHERE ${whereSql}`;

  await this.pool.query(sql, [...setValues, ...whereValues]);
}


async delete(table: string, query: Record<string, any>): Promise<void> {
  const whereKeys = Object.keys(query);
  const whereValues = Object.values(query);

  const whereSql = whereKeys.map(k => `\`${k}\` = ?`).join(" AND ");

  const sql = `DELETE FROM \`${table}\` WHERE ${whereSql}`;

  await this.pool.query(sql, whereValues);
}

}