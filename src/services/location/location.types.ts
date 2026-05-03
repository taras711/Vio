export interface Location {
  id: string;
  name: string;
  areaId: string;
  sectorId?: string | null;
  address?: string | null;
}