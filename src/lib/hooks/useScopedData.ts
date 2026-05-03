// /hooks/useScopedData.ts

import { useEffect, useState } from "react";
import { LocationService } from "@src/services/location/location.service";
import { AttendeeService } from "@src/services/attendee/attendee.service";
import type { Location } from "@src/services/location/location.types";
import type { Attendee } from "@src/services/attendee/attendee.types";

export type DataScope =
  | "visible"
  | "all"
  | "area"
  | "sector"
  | "area-sector"
  | "select-area"
  | "select-sector"
  | "select-area-sector";

interface ScopedDataResult {
  locations: Location[] | null;
  attendees: Attendee[] | null;
  loading: boolean;
  error: unknown;
}

export function useScopedData(
  scope: DataScope,
  areaId?: string | null,
  sectorId?: string | null
): ScopedDataResult {
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [attendees, setAttendees] = useState<Attendee[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        let loc: Location[] = [];
        let att: Attendee[] = [];

        switch (scope) {
          case "area":
            if (!areaId) throw new Error("areaId required for scope=area");
            loc = await LocationService.getByArea(areaId);
            att = await AttendeeService.getByArea(areaId);
            break;

          case "sector":
            if (!sectorId) throw new Error("sectorId required for scope=sector");
            loc = await LocationService.getBySector(sectorId);
            att = await AttendeeService.getBySector(sectorId);
            break;

          case "area-sector":
            console.log("LOAD FINISH", { scope, areaId, sectorId, att });
            if (!areaId || !sectorId) {
              loc = [];
              att = [];
              
              break;
            }

            att = await AttendeeService.getByAreaSector(areaId, sectorId);
            console.log("LOAD FINISH", { scope, areaId, sectorId, att });
            loc = await LocationService.getByAreaSector(areaId, sectorId);
            

            break;

          case "select-area-sector":
            if (!areaId || !sectorId) {
              loc = [];
              att = [];
              break;
            }
            loc = await LocationService.getByAreaSector(areaId, sectorId);
            att = await AttendeeService.getByAreaSector(areaId, sectorId);
            break;

          case "select-area":
            if (!areaId) {
              loc = [];
              att = [];
              break;
            }
            loc = await LocationService.getByArea(areaId);
            att = await AttendeeService.getByArea(areaId);
            break;

          case "select-sector":
            if (!sectorId) {
              loc = [];
              att = [];
              break;
            }
            loc = await LocationService.getBySector(sectorId);
            att = await AttendeeService.getBySector(sectorId);
            break;

          case "visible":
            loc = await LocationService.getVisible();
            att = await AttendeeService.getVisible();
            break;

          case "all":
            loc = await LocationService.getAll();
            att = await AttendeeService.getBySector("all");
            break;
        }

        if (!cancelled) {
          setLocations(loc);
          setAttendees(att);
        }
      } catch (err) {
        if (!cancelled) {
          setLocations([]);
          setAttendees([]);
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
      console.log("LOAD START", { scope, areaId, sectorId });
    }

    load();
    return () => {
      cancelled = true;
    };
    
  }, [scope, areaId, sectorId]);

  return { locations, attendees, loading, error };
}
