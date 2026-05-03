import { EntityPicker } from "./EntityPicker";
import { MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  description?: string;
  areaId?: string | null;
  sectorId?: string | null;
  
}

interface LocationPickerProps {
  value: string | null;
  onChange: (id: string) => void;
  locations: Location[];
  excludedIds?: string[];
  label?: string;
  fullWith?: boolean;
}

export function LocationPicker({
  value,
  onChange,
  locations,
  excludedIds = [],
  label = "Location",
  fullWith = false
}: LocationPickerProps) {
  return (
    <EntityPicker<Location>
      value={value ?? null}
      onChange={onChange}
      items={locations}
      excludedIds={excludedIds}
      label={label}
      icon={<MapPin size={18} />}
      getId={(l) => String(l.id)}
      getPrimaryText={(l) => l.name}
      getSecondaryText={(l) =>
        `${l.areaId ?? "No area"} / ${l.sectorId ?? "No sector"}`
      }
      getSearchText={(l) =>
        `${l.name} ${l.description ?? ""} ${l.areaId ?? ""} ${l.sectorId ?? ""}`
      }
      fullWidth={fullWith}
    />
  );
}
