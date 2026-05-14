import type { DatabaseAdapter } from "../../core/db/DatabaseAdapter";

export class LocationService {
  constructor(private db: DatabaseAdapter) {}

  getAll() {
    return this.db.find("locations", {});
  }

  getByArea(areaId: string) {
    return this.db.find("locations", { areaId });
  }

getByAreaVisibility(areaId: string) {
    return this.db.raw(
      `
      SELECT l.*
      FROM locations l
      JOIN areas a ON a.id = l.areaId
      WHERE l.areaId = ?
        OR l.areaId IN (
          SELECT visibleAreaId
          FROM area_visibility
          WHERE areaId = ?
        )
      `,
      [areaId, areaId]
      );
  }

  getByAreaSectorVisibility(areaId: string, sectorId: string) {
    return this.db.raw(
      `
      SELECT l.*
      FROM locations l
      JOIN areas a ON a.id = l.areaId
      WHERE l.areaId = ?
        OR l.areaId IN (
          SELECT visibleAreaId
          FROM area_visibility
          WHERE areaId = ?
        )
      AND a.sectorId = ?
      `,
      [areaId, areaId, sectorId]
    );
  }


  getBySector(sectorId: string) {
    return this.db.raw(
      `
      SELECT l.*
      FROM locations l
      JOIN areas a ON a.id = l.areaId
      WHERE a.sectorId = ?
      `,
      [sectorId]
    );
  }

  getByAreaSector(areaId: string, sectorId: string) {
    return this.db.raw(
      `
      SELECT l.*
      FROM locations l
      WHERE l.areaId = ? AND l.sectorId = ?
      `,
      [areaId, sectorId]
    );
  }


  getVisibleForUser(areaId: string) {
    return this.db.raw(
      `
      SELECT l.*
      FROM locations l
      WHERE l.areaId = ?
         OR l.areaId IN (
           SELECT visibleAreaId
           FROM area_visibility
           WHERE areaId = ?
         )
      `,
      [areaId, areaId]
    );
  }
}