import type { Location } from "./location.types";

const BASE = "/api/locations";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const LocationService = {
  getAll: async (): Promise<Location[]> => {
    const res = await fetch(`${BASE}/all`);
    return handle<Location[]>(res);
  },

  getByAreaSector: async (areaId: string, sectorId: string): Promise<Location[]> => {
    const res = await fetch(`${BASE}/by-area-sector/${encodeURIComponent(areaId)}/${encodeURIComponent(sectorId)}`);
    return handle<Location[]>(res);
  },

  getByArea: async (areaId: string): Promise<Location[]> => {
    const res = await fetch(`${BASE}/by-area/${encodeURIComponent(areaId)}`);
    return handle<Location[]>(res);
  },

  getBySector: async (sectorId: string): Promise<Location[]> => {
    const res = await fetch(`${BASE}/by-sector/${encodeURIComponent(sectorId)}`);
    return handle<Location[]>(res);
  },

  getVisible: async (): Promise<Location[]> => {
    const res = await fetch(`${BASE}/visible`);
    return handle<Location[]>(res);
  }
};
