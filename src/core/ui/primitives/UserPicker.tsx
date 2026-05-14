import { EntityPicker } from "@ui/primitives/EntityPicker"
import { Users } from "lucide-react";
import { useState } from "react";
import { EntityPickerDialog } from "./PickerDialog";

interface UserPickerProps {
  value: string | undefined;
  isOrganizer: boolean;
  currentUserId: string;
  currentUserName: string;
  onChange: (id: string) => void;
  users: User[];
  excludedIds?: string[];
  label?: string;
  fullWidth?: boolean
  required?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  position?: string;
  department?: string;
  avatarUrl?: string;
  fullName: string;
  avatar?: string;
  sectorId?: string;
  areaId?: string;
}
export function UserPicker({
  value,
  onChange,
  users,
  excludedIds = [],
  label = "User",  // ← TADY!!!
  fullWidth,
  required = false
}: UserPickerProps) {
  const [openUserPicker, setOpenUserPicker] = useState(false);
  return (
    <>
    <EntityPicker<User>
      value={value ?? null}
      required={required}
      onChange={onChange}
      items={users}
      excludedIds={excludedIds}
      label={label}               // ← TADY!!!
      icon={<Users size={18} />}
      getId={(u) => String(u.id)}
      fullWidth={fullWidth}
      getPrimaryText={(u) => u.name}
      onOpenDialog={() => setOpenUserPicker(true)}
      getSecondaryText={(u) => `${u.email} • ${u.areaId}`}
      getSearchText={(u) => `${u.name} ${u.email}`}
    />
    <EntityPickerDialog<User>
      key={users.length}
      open={openUserPicker}
      onClose={() => setOpenUserPicker(false)}
      items={users}
      getId={(u) => String(u.id)}
      getPrimaryText={(u) => u.name}
      getSecondaryText={(u) => `${u.email} • ${u.areaId}`}
      onSelect={onChange}
    />
    </>
  );
}
