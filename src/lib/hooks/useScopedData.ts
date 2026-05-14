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
  | "area-visibility"
  | "area-sector-visibility"
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

    //
    // ⭐ EARLY GUARDS – zabrání volání endpointů s null
    //
    if (
      (scope === "area" && !areaId) ||
      (scope === "sector" && !sectorId) ||
      (scope === "area-sector" && (!areaId || !sectorId)) ||
      (scope === "select-area" && !areaId) ||
      (scope === "select-sector" && !sectorId) ||
      (scope === "select-area-sector" && (!areaId || !sectorId)) ||
      (scope === "area-visibility" && !areaId) ||
      (scope === "area-sector-visibility" && (!areaId || !sectorId))
    ) {
      setLocations([]);
      setAttendees([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    async function load() {
      try {
        let loc: Location[] = [];
        let att: Attendee[] = [];

        switch (scope) {
          case "area":
            loc = await LocationService.getByArea(areaId!);
            att = await AttendeeService.getByArea(areaId!);
            break;

          case "sector":
            loc = await LocationService.getBySector(sectorId!);
            att = await AttendeeService.getBySector(sectorId!);
            break;

          case "area-sector":
            att = await AttendeeService.getByAreaSector(areaId!, sectorId!);
            loc = await LocationService.getByAreaSector(areaId!, sectorId!);
            break;

          case "select-area-sector":
            att = await AttendeeService.getByAreaSector(areaId!, sectorId!);
            loc = await LocationService.getByAreaSector(areaId!, sectorId!);
            break;

          case "select-area":
            loc = await LocationService.getByArea(areaId!);
            att = await AttendeeService.getByArea(areaId!);
            break;

          case "select-sector":
            loc = await LocationService.getBySector(sectorId!);
            att = await AttendeeService.getBySector(sectorId!);
            break;

          case "visible":
            loc = await LocationService.getVisible();
            att = await AttendeeService.getVisible();
            break;

          case "area-visibility":
            att = await AttendeeService.getByAreaVisibility(areaId!);
            loc = await LocationService.getByAreaVisibility(areaId!);
            break;

          case "area-sector-visibility":
            att = await AttendeeService.getByAreaSectorVisibility(areaId!, sectorId!);
            loc = await LocationService.getByAreaSectorVisibility(areaId!, sectorId!);
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
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [scope, areaId, sectorId]);

  return { locations, attendees, loading, error };
}

