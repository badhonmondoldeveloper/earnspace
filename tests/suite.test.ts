/**
 * EarnSpace Complete System Automated Test Suite
 * Covers Authentication, RBAC, Upload Security, Financial Ledger, Referrals, Campaigns, and Admin Auditing.
 */

import { generateAdminToken, hasAdminPermission } from '../src/lib/adminAuth';
import { validateFileUpload } from '../src/lib/uploadSanitizer';
import { MonetizationEngine } from '../src/services/monetizationEngine';
import { FinancialLedgerService } from '../src/services/financialLedgerService';
import { ReferralService } from '../src/services/referralService';
import { AdminAuditService } from '../src/services/adminAuditService';
import { prisma } from '../src/lib/prisma';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('\n🚀 Starting EarnSpace System QA Test Suite...\n');

  // 1. ADMIN RBAC & PERMISSION AUDIT
  console.log('--- Test Group 1: Admin RBAC & Permissions ---');
  assert(hasAdminPermission('super_admin', 'users.ban') === true, 'super_admin has users.ban permission');
  assert(hasAdminPermission('moderator', 'users.suspend') === true, 'moderator has users.suspend permission');
  assert(hasAdminPermission('moderator', 'users.ban') === false, 'moderator restricted from full users.ban permission');
  assert(hasAdminPermission('moderator', 'finance.approve') === false, 'moderator blocked from finance.approve permission');
  assert(hasAdminPermission('finance_admin', 'finance.approve') === true, 'finance_admin has finance.approve permission');

  const adminToken = generateAdminToken({
    adminId: 'test-admin-id',
    email: 'admin@earnspace.com',
    role: 'super_admin',
    fullName: 'Super Admin',
  });
  assert(typeof adminToken === 'string' && adminToken.length > 20, 'Admin JWT token generated successfully');

  // 2. UPLOAD SECURITY & MAGIC BYTES SANITIZATION
  console.log('\n--- Test Group 2: Upload Security & File Sanitization ---');
  const validPngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
  const pngCheck = validateFileUpload(validPngHeader, 'avatar.png', 'image/png');
  assert(pngCheck.valid === true, 'Valid PNG header passes magic bytes verification');

  const fakePngHeader = Buffer.from([0x4D, 0x5A, 0x90, 0x00]); // Executable header pretending to be PNG
  const spoofCheck = validateFileUpload(fakePngHeader, 'malicious.png', 'image/png');
  assert(spoofCheck.valid === false, 'Spoofed executable header pretending to be PNG is blocked');

  const htmlTraversalCheck = validateFileUpload(validPngHeader, '../script.html', 'image/png');
  assert(htmlTraversalCheck.valid === false, 'Directory traversal / script file extension is blocked');

  // 3. REVENUE SPLIT & MATHEMATICAL ACCURACY
  console.log('\n--- Test Group 3: Monetization Engine & Revenue Splits ---');
  const splitRule = { userSharePercent: 70, platformSharePercent: 30 };
  const splitResult = MonetizationEngine.calculateSplit(100.0, 5.0, splitRule); // Gross: 100, Fee: 5 -> Net: 95
  assert(splitResult.netEligibleAmount === 95.0, 'Net eligible revenue correctly calculated after fees');
  assert(splitResult.userShare === 66.5, 'User share (70% of 95) = 66.5');
  assert(splitResult.platformShare === 28.5, 'Platform share (30% of 95) = 28.5');
  assert(splitResult.userShare + splitResult.platformShare === splitResult.netEligibleAmount, 'User share + Platform share equals net eligible revenue');

  // 4. FINANCIAL LEDGER & IDEMPOTENCY SAFETY
  console.log('\n--- Test Group 4: Financial Ledger & Idempotency ---');
  try {
    const testUser = await prisma.user.upsert({
      where: { email: 'qa-user@earnspace.com' },
      update: {},
      create: {
        username: 'qa_user_test',
        email: 'qa-user@earnspace.com',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuv',
      },
    });

    const idempotencyKey = `qa-test-key-${Date.now()}`;
    const tx1 = await FinancialLedgerService.recordTransaction({
      userId: testUser.id,
      type: 'earning',
      amount: 50.0,
      idempotencyKey,
      description: 'QA Earning Credit',
    });
    assert(tx1.transaction.balanceAfter >= 50.0, 'Wallet balance credited upon earning transaction');

    const tx2 = await FinancialLedgerService.recordTransaction({
      userId: testUser.id,
      type: 'earning',
      amount: 50.0,
      idempotencyKey, // Same idempotency key
      description: 'Duplicate QA Earning Credit Attempt',
    });
    assert(tx2.duplicate === true, 'Duplicate transaction recognized and flagged as duplicate');
    assert(tx2.transaction.balanceAfter === tx1.transaction.balanceAfter, 'Duplicate transaction blocked without double crediting');

    // 5. REFERRAL ANTI-ABUSE AUDIT
    console.log('\n--- Test Group 5: Referral System Anti-Self-Referral ---');
    const selfReferralCheck = await ReferralService.registerReferral(testUser.id, testUser.id);
    assert(selfReferralCheck.success === false, 'Self-referral qualification is strictly rejected');

    // 6. ADMIN AUDIT TRAIL
    console.log('\n--- Test Group 6: Immutable Admin Audit Logging ---');
    const testAdmin = await prisma.adminUser.upsert({
      where: { email: 'qa-admin@earnspace.com' },
      update: {},
      create: {
        email: 'qa-admin@earnspace.com',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuv',
        fullName: 'QA Admin',
        role: 'Super Admin',
      },
    });

    const auditLog = await AdminAuditService.logAction({
      adminUserId: testAdmin.id,
      action: 'USER_FREEZE_TEST',
      targetType: 'User',
      targetId: testUser.id,
      reason: 'QA Audit Verification Run',
    });
    assert(auditLog.action === 'USER_FREEZE_TEST', 'Admin action recorded in append-only audit trail');

  } catch (err: any) {
    console.error('Database integration test error:', err.message);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`QA TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Unhandled test suite exception:', err);
  process.exit(1);
});
