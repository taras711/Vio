import { attach } from "node-firebird";

/**
 * Database table names
 * @module core/db/schema/tables
 * @description This file contains the database table names.
 */
export const TABLES = {
    audit_logs: "audit_logs",
    forms: "forms",
    assets: "assets",
    migrations: "migrations",
    permissions: "permissions",
    plugins: "plugins",
    reports: "reports",
    revoked_tokens: "revoked_tokens",
    roles: "roles",
    sectors: "sectors",
    sessions: "sessions",
    settings: "settings",
    SHIFTS: "shifts",
    skills: "skills",
    tasks: "tasks",
    attachments: "attachments",
    comments: "comments",
    history: "history",
    teams: "teams",
    users: "users",
    zones: "zones",
    zone_components: "zone_components",
    areas: "areas",
    area_visibility: "area_visibility",
    categories: "categories",
    category_assignments: "category_assignments",
    products: "products",
    product_attributes: "product_attributes",
    product_relations: "product_relations",
    plans: "plans",
    orders: "orders",
    costs: "costs",
    inspections: "inspections",
    role_permissions: "role_permissions",
    user_roles: "user_roles",
    user_permissions: "user_permissions",
    role_profiles: "role_profiles",
    role_profile_permissions: "role_profile_permissions",
    role_profile_conditions: "role_profile_conditions",
    user_profiles: "user_profiles",
    projects: "projects",
    notes: "notes",
    audit_instances: "audit_instances",
    events: "events",
    event_attendees: "event_attendees",
    event_feedback: "event_feedback",
    audit_results: "audit_results",
    suggestions: "suggestions",
    actions: "actions",
    //celkem tabulek: 

} as const;

export type TableName = typeof TABLES[keyof typeof TABLES];