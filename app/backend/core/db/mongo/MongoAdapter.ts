import { DatabaseAdapter } from "../DatabaseAdapter";
import { MongoClient } from "mongodb";

export class MongoAdapter implements DatabaseAdapter {
  private db;
  readonly type = "mongo";
  constructor(uri: string, dbName: string) {
    const client = new MongoClient(uri);
    this.db = client.db(dbName);
  }

  async insert<T>(collection: string, data: T): Promise<void> {
    await this.db.collection(collection).insertOne(data as any);
    }

    async update<T>(collection: string, query: any, data: Partial<T>): Promise<void> {
    await this.db.collection(collection).updateOne(query, { $set: data as any });
    }

    async findById<T>(collection: string, id: string): Promise<T | null> {
    const ObjectId = (MongoClient as any).ObjectId;
    const row = await this.db.collection(collection).findOne({ _id: new ObjectId(id) });
    return row as unknown as T | null;
    }

    async findByEmail<T>(collection: string, email: string): Promise<T | null> {
    const row = await this.db.collection(collection).findOne({ email });
    return row as unknown as T | null;
    }

    async find<T>(collection: string, query: any): Promise<T[]> {
    const rows = await this.db.collection(collection).find(query).toArray();
    return rows as unknown as T[];
    }

    async findOne<T>(collection: string, query: any): Promise<T | null> {
    const row = await this.db.collection(collection).findOne(query);
    return row as unknown as T | null;
    }

    async delete(collection: string, query: any): Promise<void> {
    await this.db.collection(collection).deleteOne(query);
    }

    async raw(command: any): Promise<any> {
    return this.db.command(command);
    }
}