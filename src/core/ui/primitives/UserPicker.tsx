import { EntityPicker } from "@ui/primitives/EntityPicker"
import { Users } from "lucide-react";

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
  fullWidth
}: UserPickerProps) {
  return (
    <EntityPicker<User>
      value={value ?? null}
      onChange={onChange}
      items={users}
      excludedIds={excludedIds}
      label={label}               // ← TADY!!!
      icon={<Users size={18} />}
      getId={(u) => String(u.id)}
      fullWidth={fullWidth}
      getPrimaryText={(u) => u.name}
      getSecondaryText={(u) => `${u.email} • ${u.areaId}`}
      getSearchText={(u) => `${u.name} ${u.email}`}
    />
  );
}
