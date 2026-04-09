// core/db/DatabaseAdapter.ts

export interface DatabaseAdapter {
  type: "postgres" | "mysql" | "mongo" | "firebird" | "sqlite";

  find<T>(table: string, query: object): Promise<T[]>;
  findOne<T>(table: string, query: object): Promise<T | null>;
  insert<T>(table: string, data: T): Promise<void>;
  update<T>(table: string, id: string, data: Partial<T>): Promise<void>;
  delete(table: string, id: string): Promise<void>;
  raw(sql: string, params?: any[]): Promise<any>;
  findById<T>(table: string, id: string): Promise<T | null>;
  findByEmail<T>(table: string, email: string): Promise<T | null>;
}