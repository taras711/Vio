// backend/core/auth/PermissionResolver.ts
import type { DatabaseAdapter } from "../db/DatabaseAdapter";
import { TABLES } from "../db/schema/tables";

export interface PermissionContext {
  machineId?: string;
  area?: string;
  sectorId?: string;
}

export class PermissionResolver {
  constructor(private db: DatabaseAdapter) {}

  /**
   * Resolve the final effective permission set for a user.
   * Order: roles → profiles → user overrides (deny wins).
   */
  async resolveForUser(
    userId: string,
    _ctx?: PermissionContext
  ): Promise<Set<string>> {
    const granted = new Set<string>();
    const denied  = new Set<string>();

    // 1) Roles → role_permissions
    const userRoles = await this.db.find<{ roleId: string }>(
      TABLES.user_roles, { userId }
    );
    for (const { roleId } of userRoles) {
      const rolePerm = await this.db.find<{ permissionId: string }>(
        TABLES.role_permissions, { roleId }
      );
      for (const rp of rolePerm) {
        const perm = await this.db.findById<{ key: string }>(
          TABLES.permissions, rp.permissionId
        );
        if (perm?.key) granted.add(perm.key);
      }
    }

    // 2) Role profiles → profile permissions (with optional context conditions)
    const userProfiles = await this.db.find<{ profileId: string }>(
      TABLES.user_profiles, { userId }
    );
    for (const { profileId } of userProfiles) {
      // Check conditions
      const conditions = await this.db.find<{
        conditionType: string; operator: string; value: string;
      }>(TABLES.role_profile_conditions, { profileId });

      const conditionsMet = this.evaluateConditions(conditions, _ctx);
      if (!conditionsMet) continue;

      const profilePerms = await this.db.find<{
        permissionId: string; mode: string;
      }>(TABLES.role_profile_permissions, { profileId });

      for (const pp of profilePerms) {
        const perm = await this.db.findById<{ key: string }>(
          TABLES.permissions, pp.permissionId
        );
        if (!perm?.key) continue;
        if (pp.mode === "deny") denied.add(perm.key);
        else granted.add(perm.key);
      }
    }

    // 3) User-level overrides (highest priority except deny)
    const userPerms = await this.db.find<{
      permissionId: string; mode: string;
    }>(TABLES.user_permissions, { userId });

    for (const up of userPerms) {
      const perm = await this.db.findById<{ key: string }>(
        TABLES.permissions, up.permissionId
      );
      if (!perm?.key) continue;
      if (up.mode === "deny") denied.add(perm.key);
      else granted.add(perm.key);
    }

    // 4) Deny wins — remove all denied from granted
    for (const d of denied) granted.delete(d);

    return granted;
  }

  /**
   * Check if a resolved set contains a permission (wildcard aware).
   */
  static can(
    resolved: Set<string>,
    permission: string
  ): boolean {
    return resolved.has("*") || resolved.has(permission);
  }

  private evaluateConditions(
    conditions: Array<{ conditionType: string; operator: string; value: string }>,
    ctx?: PermissionContext
  ): boolean {
    if (!conditions.length) return true;
    return conditions.every(c => {
      const ctxValue = (ctx as any)?.[c.conditionType];
      if (ctxValue === undefined) return true; // no context → pass
      if (c.operator === "=")  return String(ctxValue) === c.value;
      if (c.operator === "!=") return String(ctxValue) !== c.value;
      if (c.operator === "in") return c.value.split(",").includes(String(ctxValue));
      return true;
    });
  }
}