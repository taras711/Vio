// core/ui/layout/Navigation.ts
import {
  Component,
  Factory,
  AlertTriangle,
  PlusCircle,
  BarChart3,
  Users,
  BriefcaseBusiness,
  Calendar,
  ClipboardList
} from "lucide-react";
import { PERMISSIONS } from "../../../../shared/permissions";


export const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: Component,
    path: "/",
    perm: [],
  },
  {
    label: "Stroje",
    icon: Factory,
    path: "/machines",
    perm: [PERMISSIONS.MACHINES_VIEW],
  },
  {
    label: "Poruchy a hlášení",
    icon: AlertTriangle,
    path: "/issues",
    perm: [PERMISSIONS.ISSUES_VIEW],
  },
  {
    label: "Zadat nové",
    icon: PlusCircle,
    path: "/new",
    perm: [PERMISSIONS.ISSUES_CREATE],
  },
  {
    label: "Reporty",
    icon: ClipboardList,
    path: "/reports",
    perm: [PERMISSIONS.REPORTS_VIEW],
  },
  {
    label: "Uživatelé",
    icon: Users,
    path: "/users",
    perm: [PERMISSIONS.USERS_VIEW],
  },
  {
    label: "Management",
    icon: BriefcaseBusiness,
    path: "/management",
    perm: [PERMISSIONS.USERS_MANAGE],
  }
] as const;