
export const TABLES = {
    audit_logs: "audit_logs",
    forms: "forms",
    machines: "assets",
    migrations: "migrations",
    permissions: "permissions",
    plugins: "plugins",
    reports: "reports",
    revoked_tokens: "revoked_tokens",
    rolees: "roles",
    sectors: "sectors",
    sessions: "sessions",
    settings: "settings",
    SHIFTS: "shifts",
    skills: "skills",
    tasks: "tasks",
    task_attachments: "task_attachments",
    task_comments: "task_comments",
    task_history: "task_history",
    teams_groups: "teams_groups",
    users: "users",
    zones: "zones",
    zone_components: "zone_components"
} as const;

export type TableName = typeof TABLES[keyof typeof TABLES];