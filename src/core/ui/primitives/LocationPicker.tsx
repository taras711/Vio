import { useState } from "react";
import { EntityPicker } from "./EntityPicker";
import { MapPin } from "lucide-react";
import { EntityPickerDialog } from "./PickerDialog";

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
  const [openUserPicker, setOpenUserPicker] = useState(false);
  return (
    <>
    <EntityPicker<Location>
      value={value ?? null}
      onChange={onChange}
      items={locations}
      excludedIds={excludedIds}
      label={label}
      icon={<MapPin size={18} />}
      getId={(l) => String(l.id)}
      getPrimaryText={(l) => l.name}
      onOpenDialog={() => setOpenUserPicker(true)}
      getSecondaryText={(l) =>
        `${l.areaId ?? "No area"} / ${l.sectorId ?? "No sector"}`
      }
      getSearchText={(l) =>
        `${l.name} ${l.description ?? ""} ${l.areaId ?? ""} ${l.sectorId ?? ""}`
      }
      fullWidth={fullWith}
    />
    <EntityPickerDialog<Location>
      key={locations.length}
      open={openUserPicker}
      onClose={() => setOpenUserPicker(false)}
      items={locations}
      getId={(l) => String(l.id)}
      getPrimaryText={(l) => l.name}
      getSecondaryText={(l) =>
        `${l.areaId ?? "No area"} / ${l.sectorId ?? "No sector"}`
      }
      onSelect={onChange}
    />
    </>
  );
}
