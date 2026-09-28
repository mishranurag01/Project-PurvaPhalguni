/**
 * Prototype Audit Service Placeholder
 *
 * Status: NOT AN IMMUTABLE PRODUCTION AUDIT LOG.
 * Records prototype user actions in memory for session inspection.
 * Reset on browser refresh.
 */

import { AuditLogEntry, UserRole } from '../../types/practice';
import { PracticeStore } from '../store';

export const auditService = {
  status: 'Prototype activity record — not an immutable audit log',

  async getRecentLogs(): Promise<AuditLogEntry[]> {
    return PracticeStore.getAuditLogs();
  },

  async recordAction(
    actorId: string,
    actorName: string,
    actorRole: UserRole,
    action: AuditLogEntry['action'],
    details: string,
    isSensitive = false
  ): Promise<void> {
    PracticeStore.logAction(actorId, actorName, actorRole, action, details, isSensitive);
  }
};
