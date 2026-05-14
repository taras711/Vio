// /attendee/attendee.service.ts

import type { Attendee } from "./attendee.types";

const BASE = "/api/users/query";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const AttendeeService = {
  getByArea: async (areaId: string): Promise<Attendee[]> => {
    const res = await fetch(`${BASE}/by-area/${encodeURIComponent(areaId)}`);
    return handle<Attendee[]>(res);
  },

  getByAreaVisibility: async (areaId: string): Promise<Attendee[]> => {
    const res = await fetch(`${BASE}/by-area-visibility/${encodeURIComponent(areaId)}`);
    return handle<Attendee[]>(res);
  },

  getByAreaSectorVisibility: async (areaId: string, sectorId: string): Promise<Attendee[]> => {
    const res = await fetch(`${BASE}/by-area-sector-visibility/${encodeURIComponent(areaId)}/${encodeURIComponent(sectorId)}`);
    return handle<Attendee[]>(res);
  },

  getByAreaSector: async (areaId: string, sectorId: string): Promise<Attendee[]> => {
    const res = await fetch(`${BASE}/by-area-sector/${encodeURIComponent(areaId)}/${encodeURIComponent(sectorId)}`);
    return handle<Attendee[]>(res);
  },

  getBySector: async (sectorId: string): Promise<Attendee[]> => {
    const res = await fetch(`${BASE}/by-sector/${encodeURIComponent(sectorId)}`);
    return handle<Attendee[]>(res);
  },

  getVisible: async (): Promise<Attendee[]> => {
    const res = await fetch(`${BASE}/visible`);
    return handle<Attendee[]>(res);
  }
};
