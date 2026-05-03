export interface Location {
  id: string;
  name: string;
  areaId: string;
  sectorId?: string;
  address?: string;
  // cokoliv máš v DB
}

export type LocationScope = "all" | "by-area" | "by-sector" | "visible";