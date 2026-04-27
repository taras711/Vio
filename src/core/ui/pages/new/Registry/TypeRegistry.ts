import { PERMISSIONS } from "../../../../../../shared/permissions";
import { EventForm } from "@ui/pages/forms/add/EventForm";
import { TaskForm } from "@ui/pages/forms/add/TaskForm";
import { ProblemForm } from "@ui/pages/forms/add/ProblemForm";
import { PlanForm } from "@ui/pages/forms/add/PlanForm";
import { MaintenanceForm } from "@ui/pages/forms/add/MaintenanceForm";
import { AuditForm } from "@ui/pages/forms/add/AuditForm";
import { CalendarPlus,
    ClipboardList,
    AlertTriangle,
    BarChart3,
    Users,
    BriefcaseBusiness,
    Calendar } from "lucide-react";

export const addRegistry = {
  event: {
    title: "Create Event",
    icon: CalendarPlus,
    description: "Meeting, shift, appointment",
    component: EventForm,
    endpoint: "/events",
    perm: PERMISSIONS.EVENTS_CREATE,
  },
  task: {
    title: "Create Task",
    icon: ClipboardList,
    description: "Assign a task to yourself or others",
    component: TaskForm,
    endpoint: "/tasks",
    perm: PERMISSIONS.TASKS_CREATE,
  },
  problem: {
    title: "Report Problem",
    icon: AlertTriangle,
    description: "Incident, malfunction, issue",
    component: ProblemForm,
    endpoint: "/problems",
    perm: PERMISSIONS.PROBLEMS_CREATE,
  },
  plan: {
    title: "Create Plan",
    icon: BarChart3,
    description: "Create production or work plan",
    component: PlanForm,
    endpoint: "/plans",
    perm: PERMISSIONS.PLANS_CREATE,
  },
  maintenance: {
    title: "Create Maintenance",
    icon: BriefcaseBusiness,
    description: "Create maintenance plan",
    component: MaintenanceForm,
    endpoint: "/maintenances",
    perm: PERMISSIONS.MAINTENANCE_CREATE,
  },
  audit: {
    title: "Create Audit",
    icon: Users,
    description: "Create audit plan",
    component: AuditForm,
    endpoint: "/audits",
    perm: PERMISSIONS.AUDIT_CREATE,
  }
} as const;

export type AddRegistryKey = keyof typeof addRegistry;
