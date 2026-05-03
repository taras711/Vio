import { DatabaseAdapter } from "../../core/db/DatabaseAdapter";
export class SectorService {
  constructor(private db: DatabaseAdapter) {}

  getAll() {
    return this.db.find("sectors", {});
  }

  getById(id: string) {
    return this.db.findById("sectors", id);
  }
}