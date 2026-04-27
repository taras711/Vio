// shared/permissions.ts
export const PERMISSIONS = {
  // Users
  USERS_VIEW:          "users.view",
  USERS_EDIT:          "users.edit",
  USERS_DELETE:        "users.delete",
  USERS_MANAGE:        "users.manage",
  USERS_SUPERADMIN:    "users.superadmin",

  // Issues
  ISSUES_VIEW:         "issues.view",
  ISSUES_CREATE:       "issues.create",
  ISSUES_READ:         "issues.read",
  ISSUES_WRITE:        "issues.write",
  ISSUES_DELETE:       "issues.delete",
  ISSUES_MANAGE:       "issues.manage",

  // Reports
  REPORTS_VIEW:        "reports.view",
  REPORTS_CREATE:      "reports.create",
  REPORTS_MANAGE:      "reports.manage",
  REPORTS_DELETE:      "reports.delete",


  // History
  HISTORY_VIEW:        "history.view",
  HISTORY_CREATE:      "history.create",
  HISTORY_MANAGE:      "history.manage",
  HISTORY_DELETE:      "history.delete",

  // Skills
  SKILLS_VIEW:         "skills.view",
  SKILLS_READ:         "skills.read",
  SKILLS_CREATE:       "skills.create",
  SKILLS_MANAGE:       "skills.manage",
  SKILLS_DELETE:       "skills.delete",

  // Comments
  COMMENTS_VIEW:       "comments.view",
  COMMENTS_READ:       "comments.read",
  COMMENTS_CREATE:     "comments.create",
  COMMENTS_MANAGE:     "comments.manage",
  COMMENTS_DELETE:     "comments.delete",

  // Roles
  ROLES_VIEW:          "roles.view",
  ROLES_CREATE:        "roles.create",
  ROLES_MANAGE:        "roles.manage",
  ROLES_DELETE:        "roles.delete",

  // Attachments
  ATTACHMENTS_VIEW:    "attachments.view",
  ATTACHMENTS_CREATE:  "attachments.create",
  ATTACHMENTS_MANAGE:  "attachments.manage",
  ATTACHMENTS_DELETE:  "attachments.delete",

  // Plugins
  PLUGINS_VIEW:        "plugins.view",
  PLUGINS_CREATE:      "plugins.create",
  PLUGINS_MANAGE:      "plugins.manage",
  PLUGINS_DELETE:      "plugins.delete",

  // events
  EVENTS_VIEW:         "events.view",
  EVENTS_CREATE:       "events.create",
  EVENTS_MANAGE:       "events.manage",
  EVENTS_DELETE:       "events.delete",

  //plans
  PLANS_VIEW:          "plans.view",
  PLANS_CREATE:        "plans.create",
  PLANS_MANAGE:        "plans.manage",
  PLANS_DELETE:        "plans.delete",

  // Problems
  PROBLEMS_VIEW:       "problems.view",
  PROBLEMS_CREATE:     "problems.create",
  PROBLEMS_MANAGE:     "problems.manage",
  PROBLEMS_DELETE:     "problems.delete",

  // Maintenance
  MAINTENANCE_VIEW:    "maintenance.view",
  MAINTENANCE_CREATE:  "maintenance.create",
  MAINTENANCE_MANAGE:  "maintenance.manage",
  MAINTENANCE_DELETE:  "maintenance.delete",

  // Audit
  AUDIT_VIEW:          "audit.view",
  AUDIT_CREATE:        "audit.create",
  AUDIT_MANAGE:        "audit.manage",
  AUDIT_DELETE:        "audit.delete",

  // Sectors
  SECTORS_VIEW:        "sectors.view",
  SECTORS_CREATE:      "sectors.create",
  SECTORS_MANAGE:      "sectors.manage",
  SECTORS_DELETE:      "sectors.delete",

  // Tasks
  TASKS_VIEW:          "tasks.view",
  TASKS_CREATE:        "tasks.create",
  TASKS_MANAGE:        "tasks.manage",
  TASKS_DELETE:        "tasks.delete",

  // Zones
  ZONES_VIEW:          "zones.view",
  ZONES_CREATE:        "zones.create",
  ZONES_MANAGE:        "zones.manage",
  ZONES_DELETE:        "zones.delete",

  // Teams
  TEAMS_VIEW:          "teams.view",
  TEAMS_CREATE:        "teams.create",
  TEAMS_MANAGE:        "teams.manage",
  TEAMS_DELETE:        "teams.delete",

  // Forms
  FORMS_VIEW:          "forms.view",
  FORMS_CREATE:        "forms.create",
  FORMS_MANAGE:        "forms.manage",
  FORMS_DELETE:        "forms.delete",

  // Shifts
  SHIFTS_VIEW:         "shifts.view",
  SHIFTS_CREATE:       "shifts.create",
  SHIFTS_MANAGE:       "shifts.manage",
  SHIFTS_DELETE:       "shifts.delete",


  // Machines / Assets
  MACHINES_VIEW:       "machines.view",
  MACHINES_READ:       "machines.read",
  MACHINES_MANAGE:     "machines.manage",
  MACHINES_CREATE:     "machines.create",
  MACHINES_DELETE:     "machines.delete",

  // System
  CONFIG_EDIT:         "config.edit",
  CONFIG_READ:         "config.read",
  CONFIG_MANAGE:       "config.manage",
  SYSTEM_BACKUP:       "system.backup",

  // Wildcard (superadmin)
  WILDCARD:            "*",
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];