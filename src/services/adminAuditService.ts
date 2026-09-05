import { prisma } from '@/lib/prisma';

export interface LogAdminActionParams {
  adminUserId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  beforeJson?: any;
  afterJson?: any;
  ipAddress?: string;
  userAgent?: string;
  reason: string;
}

export class AdminAuditService {
  /**
   * Logs an immutable administrative action to audit_logs
   */
  static async logAction(params: LogAdminActionParams) {
    const {
      adminUserId,
      action,
      targetType,
      targetId,
      beforeJson = {},
      afterJson = {},
      ipAddress,
      userAgent,
      reason,
    } = params;

    const auditLog = await prisma.auditLog.create({
      data: {
        adminUserId,
        action,
        targetType,
        targetId,
        beforeJson: typeof beforeJson === 'string' ? beforeJson : JSON.stringify(beforeJson),
        afterJson: typeof afterJson === 'string' ? afterJson : JSON.stringify(afterJson),
        ipAddress,
        userAgent,
        reason,
      },
    });

    return auditLog;
  }
}

