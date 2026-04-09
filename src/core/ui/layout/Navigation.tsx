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


export const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: Component,
    path: "/",
  },
  {
    label: "Stroje",
    icon: Factory,
    path: "/machines",
  },
  {
    label: "Poruchy a hlášení",
    icon: AlertTriangle,
    path: "/issues",
  },
  {
    label: "Zadat nové",
    icon: PlusCircle,
    path: "/new",
  },
  {
    label: "Reporty",
    icon: ClipboardList,
    path: "/reports",
  },
  {
    label: "Uživatelé",
    icon: Users,
    path: "/users",
  },
  {
    label: "Management",
    icon: BriefcaseBusiness,
    path: "/management",
  }
] as const;