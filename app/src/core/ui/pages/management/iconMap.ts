import {
  Users,
  UserStar,
  UserRoundKey,
  ShieldUser,
  Package,
  MonitorCog,
  FolderKey,
  CircleStar,
  Notebook,
  Award,
  Waypoints,
  Factory,
  Settings2,
  Bolt,
  ChevronLeft,
  ChevronRight,
  UserRoundPen
} from "lucide-react";

export const ICON_MAP = {
  users: Users,
  administration: UserRoundPen,
  role: UserStar,
  permissions: UserRoundKey,
  security: ShieldUser,
  plugins: Package,
  system: MonitorCog,
  matrix: FolderKey,
  roles: CircleStar,
  audit: Notebook,
  license: Award,
  api: Waypoints,
  machines: Factory,
  management: Settings2,
  maintenance: Bolt,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight
} as const;

export type IconName = keyof typeof ICON_MAP;