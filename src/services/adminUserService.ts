import { prisma } from '@/lib/prisma';
import { AdminAuditService } from './adminAuditService';

export class AdminUserService {
  /**
   * Updates user status (active, restricted, suspended, banned) with mandatory audit logging
   */
  static async updateUserStatus(adminId: string, userId: string, status: string, reason: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    await AdminAuditService.logAction({
      adminUserId: adminId,
      action: `user.${status}`,
      targetType: 'user',
      targetId: userId,
      beforeJson: { status: user.status },
      afterJson: { status: updatedUser.status },
      reason,
      ipAddress,
    });

    return updatedUser;
  }

  /**
   * Toggles wallet freeze state
   */
  static async setWalletFreezeState(adminId: string, userId: string, isFrozen: boolean, reason: string, ipAddress?: string) {
    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId, availableBalance: 0, pendingBalance: 0 },
      });
    }

    const updatedWallet = await prisma.wallet.update({
      where: { id: wallet.id },
      data: { isFrozen },
    });

    await AdminAuditService.logAction({
      adminUserId: adminId,
      action: isFrozen ? 'wallet.freeze' : 'wallet.unfreeze',
      targetType: 'wallet',
      targetId: wallet.id,
      beforeJson: { isFrozen: wallet.isFrozen },
      afterJson: { isFrozen: updatedWallet.isFrozen },
      reason,
      ipAddress,
    });

    return updatedWallet;
  }
}

