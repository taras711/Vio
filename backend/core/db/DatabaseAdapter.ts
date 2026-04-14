// core/db/DatabaseAdapter.ts

export interface DatabaseAdapter {
  type: "postgres" | "mysql" | "mongo" | "firebird" | "sqlite";
  
  ping(): Promise<void>;
  find<T>(table: string, query: Record<string, any>): Promise<T[]>;
  findOne<T>(table: string, query: Record<string, any>): Promise<T | null>;
  insert<T extends Record<string, any>>(table: string, data: T): Promise<void>;
  update<T extends Record<string, any>>(table: string, query: Record<string, any>, data: Partial<T>): Promise<void>;
  delete(table: string, query: Record<string, any>): Promise<void>;
  raw(sql: string, params?: any[]): Promise<any>;
  findById<T>(table: string, id: string): Promise<T | null>;
  findByEmail<T>(table: string, email: string): Promise<T | null>;
}

