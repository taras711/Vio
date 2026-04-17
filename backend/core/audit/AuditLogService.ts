// core/audit/AuditLogService.ts

import type { DatabaseAdapter } from "../db/DatabaseAdapter";
import { TABLES } from "../db/schema/tables";

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details?: any;
}

export class AuditLogService {
  constructor(private db: DatabaseAdapter) {}

  async log(entry: Omit<AuditLogEntry, "id" | "timestamp">) {
    const full: AuditLogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...entry
    };

    await this.db.insert(TABLES.audit_logs, full);
  }
}