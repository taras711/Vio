import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";

export class UserQueryService {
  constructor(private db: DatabaseAdapter) {}

  getAll() {
    return this.db.find("users", {});
  }
  getByArea(areaId: string) {
    return this.db.raw(`
      SELECT u.*, u.areaId, a.sectorId
      FROM users u
      LEFT JOIN areas a ON a.id = u.areaId
      WHERE u.areaId = ?
    `, [areaId]);
  }

  getBySector(sectorId: string) {
    return this.db.raw(`
      SELECT u.*, u.areaId, a.sectorId
      FROM users u
      JOIN areas a ON a.id = u.areaId
      WHERE a.sectorId = ?
    `, [sectorId]);
  }


  getByAreaSector(areaId: string, sectorId: string) {
    return this.db.safeRaw(`
      SELECT u.*, u.areaId, a.sectorId
      FROM users u
      JOIN areas a ON a.id = u.areaId
      WHERE u.areaId = ? AND a.sectorId = ?
    `, [areaId, sectorId]);
  }

  getVisibleForUser(areaId: string) {
    return this.db.raw(`
      SELECT u.*, u.areaId, a.sectorId
      FROM users u
      LEFT JOIN areas a ON a.id = u.areaId
      WHERE u.areaId = ?
        OR u.areaId IN (
          SELECT visibleAreaId
          FROM area_visibility
          WHERE areaId = ?
        )
    `, [areaId, areaId]);
  }

}