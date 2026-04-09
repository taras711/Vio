import { DatabaseAdapter } from "../DatabaseAdapter";
import firebird from "node-firebird";

export class FirebirdAdapter implements DatabaseAdapter {
  private options;
  readonly type = "firebird";

  constructor(options: any) {
    this.options = options;
  }

  private async connect() {
    return new Promise<any>((resolve, reject) => {
      firebird.attach(this.options, (err, db) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    const sql = `SELECT * FROM ${table} WHERE id = ?`;
    const db = await this.connect();
    return new Promise((resolve, reject) => {
      db.query(sql, [id], (err: any, result: any) => {
        db.detach();
        if (err) reject(err);
        else resolve(result.rows[0] ?? null);
      });
    });
  }

  async findByEmail<T>(table: string, email: string): Promise<T | null> {
    const sql = `SELECT * FROM ${table} WHERE email = ?`;
    const db = await this.connect();
    return new Promise<T | null>((resolve, reject) => {
      db.query(sql, [email], (err: any, result: any) => {
        db.detach();
        if (err) reject(err);
        else resolve(result.rows[0] ?? null);
      });
    });
  }

    async raw(command: string): Promise<any> {
    const db = await this.connect();
    return new Promise((resolve, reject) => {
        db.query(command, (err: any, result: any) => {
        db.detach();
        if (err) reject(err);
        else resolve(result);
        });
    });
    }

    async find<T>(table: string, query: any): Promise<T[]> {
        const db = await this.connect();
        const where = Object.keys(query)
            .map(k => `${k} = ?`)
            .join(" AND ");

        const values = Object.values(query);

        return new Promise((resolve, reject) => {
            db.query(
            `SELECT * FROM ${table} WHERE ${where}`,
            values,
            (err: any, result: any) => {
                db.detach();
                if (err) reject(err);
                else resolve(result as unknown as T[]);
            }
            );
        });
    }

  async findOne<T>(table: string, query: any): Promise<T | null> {
    const rows = await this.find<T>(table, query);
    return rows[0] ?? null;
  }

    async insert<T>(table: string, data: T): Promise<void> {
        const db = await this.connect();
        const obj = data as any;

        const keys = Object.keys(obj);
        const values = Object.values(obj);
        const placeholders = keys.map(() => "?").join(",");

        return new Promise((resolve, reject) => {
            db.query(
            `INSERT INTO ${table} (${keys.join(",")}) VALUES (${placeholders})`,
            values,
            (err: any) => {
                db.detach();
                if (err) reject(err);
                else resolve();
            }
            );
        });
    }

    async update<T>(table: string, query: any, data: Partial<T>): Promise<void> {
        const db = await this.connect();
        const obj = data as any;

        const set = Object.keys(obj).map(k => `${k} = ?`).join(",");
        const where = Object.keys(query).map(k => `${k} = ?`).join(" AND ");

        const values = [...Object.values(obj), ...Object.values(query)];

        return new Promise((resolve, reject) => {
            db.query(
            `UPDATE ${table} SET ${set} WHERE ${where}`,
            values,
            (err: any) => {
                db.detach();
                if (err) reject(err);
                else resolve();
            }
            );
        });
    }

    async delete(table: string, query: any): Promise<void> {
        const db = await this.connect();

        const where = Object.keys(query).map(k => `${k} = ?`).join(" AND ");
        const values = Object.values(query);

        return new Promise((resolve, reject) => {
            db.query(
            `DELETE FROM ${table} WHERE ${where}`,
            values,
            (err: any) => {
                db.detach();
                if (err) reject(err);
                else resolve();
            }
            );
        });
    }
}