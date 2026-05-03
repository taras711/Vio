import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";
import { PermissionResolver } from "../../core/auth/PermissionResolver";
import { TABLES } from "../../core/db/schema/tables";
export class AreaService {

  constructor(private db:DatabaseAdapter) {
    this.db = db;
  }

  async getAll() {
    return this.db.find(TABLES.areas, {});
  }

  async getById(id: string) {
    return this.db.findById(TABLES.areas, id);
  }
}