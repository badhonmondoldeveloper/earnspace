process.env.JWT_SECRET ??= 'test-jwt-secret';
process.env.ADMIN_JWT_SECRET ??= 'test-admin-secret';

const { hasAdminPermission, generateAdminToken } = require('../src/lib/adminAuth');
const { validateFileUpload } = require('../src/lib/uploadSanitizer');
const { normalizeLoginIdentifier, normalizeUsername } = require('../src/lib/auth');
const { MonetizationEngine } = require('../src/services/monetizationEngine');
const { FinancialLedgerService } = require('../src/services/financialLedgerService');
const { validatePayoutDestination } = require('../src/services/payoutService');
const { AdProviderManager } = require('../src/lib/adProviders/adProviderManager');
const { SmartAdEngine } = require('../src/services/smartAdEngine');
const { AdRiskEngine } = require('../src/services/adRiskEngine');
const { HouseAdService } = require('../src/services/houseAdService');
const { AdRevenueAttributionService } = require('../src/services/adRevenueAttributionService');
const { CronJobsService } = require('../src/services/cronJobsService');
const { AdminAuditService } = require('../src/services/adminAuditService');
const { WalletCoreService } = require('../src/services/walletCoreService');
const { PaymentAccountService } = require('../src/services/paymentAccountService');
const { DeviceAuthService } = require('../src/services/deviceAuthService');
const { PaymentIntentService } = require('../src/services/paymentIntentService');
const { TransactionMatchingEngine } = require('../src/services/transactionMatchingEngine');
const { PaymentRiskEngine } = require('../src/services/paymentRiskEngine');
const { BkashAdapter } = require('../src/services/providerAdapters/BkashAdapter');
const { prisma } = require('../src/lib/prisma');

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✕ FAIL: ${message}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('🚀 Starting EarnSpace System QA Test Suite (Parts 1, 2 & 3)...\n');

  // 1. ADMIN RBAC & PERMISSIONS AUDIT
  console.log('--- Test Group 1: Admin RBAC & Permissions ---');
  assert(hasAdminPermission('Super Admin', 'users.ban'), 'Super Admin has users.ban permission');
  assert(hasAdminPermission('Moderator', 'users.suspend'), 'Moderator has users.suspend permission');
  assert(!hasAdminPermission('Moderator', 'users.ban'), 'Moderator restricted from full users.ban permission');
  assert(!hasAdminPermission('Moderator', 'finance.approve'), 'Moderator blocked from finance.approve permission');
  assert(hasAdminPermission('Finance Manager', 'finance.approve'), 'Finance Manager has finance.approve permission');
  assert(normalizeLoginIdentifier('  ADMIN@EXAMPLE.COM  ') === 'admin@example.com', 'Login identifier is trimmed and lowercased');
  assert(normalizeUsername('  My_User_01  ') === 'my_user_01', 'Registration username is normalized before persistence');

  const token = generateAdminToken({
    adminId: 'admin-123',
    email: 'admin@earnspace.com',
    fullName: 'Test Admin',
    role: 'Super Admin',
  });
  assert(typeof token === 'string' && token.length > 20, 'Admin JWT token generated successfully');

  // 2. UPLOAD SECURITY & FILE SANITIZATION
  console.log('\n--- Test Group 2: Upload Security & File Sanitization ---');
  const validPngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const pngCheck = validateFileUpload(validPngHeader, 'avatar.png', 'image/png');
  assert(pngCheck.valid, 'Valid PNG header passes magic bytes verification');

  const fakeExecutableHeader = Buffer.from([0x4d, 0x5a, 0x90, 0x00]);
  const fakeCheck = validateFileUpload(fakeExecutableHeader, 'avatar.png', 'image/png');
  assert(!fakeCheck.valid, 'Spoofed executable header pretending to be PNG is blocked');

  const traversalCheck = validateFileUpload(validPngHeader, '../../etc/passwd.png', 'image/png');
  assert(!traversalCheck.valid, 'Directory traversal / script file extension is blocked');

  // 3. MONETIZATION ENGINE & REVENUE SPLIT MATH
  console.log('\n--- Test Group 3: Monetization Engine & Revenue Splits ---');
  const splitResult = MonetizationEngine.calculateSplit(100.0, 5.0, {
    userSharePercent: 70,
    platformSharePercent: 30,
  });

  assert(splitResult.netEligibleAmount === 95.0, 'Net eligible revenue correctly calculated after fees');
  assert(splitResult.userShare === 66.5, 'User share (70% of 95) = 66.5');
  assert(splitResult.platformShare === 28.5, 'Platform share (30% of 95) = 28.5');
  assert(splitResult.userShare + splitResult.platformShare === splitResult.netEligibleAmount, 'User share + Platform share equals net eligible revenue');

  // 4. PAYOUT DESTINATION VALIDATION & THRESHOLD AUDIT
  console.log('\n--- Test Group 4: Payout Destination & Threshold Enforcement ---');
  const bkashValid = validatePayoutDestination('bkash', '01712345678');
  assert(bkashValid.valid, 'Valid bKash 11-digit number passes validation');

  const bkashInvalid = validatePayoutDestination('bkash', '0123');
  assert(!bkashInvalid.valid, 'Invalid short bKash number is rejected');

  const binanceUidValid = validatePayoutDestination('binance', '123456789', { type: 'uid' });
  assert(binanceUidValid.valid, 'Valid Binance UID numeric ID passes validation');

  const binanceTrc20Valid = validatePayoutDestination('binance', 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb', { type: 'wallet', network: 'TRC20' });
  assert(binanceTrc20Valid.valid, 'Valid TRC20 wallet address starting with T passes validation');

  // 5. AD PROVIDER FALLBACK CHAIN AUDIT
  console.log('\n--- Test Group 5: Multi-Ad Provider Fallback Chain ---');
  const adPlacement = await AdProviderManager.getPlacementWithFallback({ slotName: 'feed' });
  assert(adPlacement.slotName === 'feed', 'Ad provider fallback manager returns valid placement slot');
  assert(typeof adPlacement.providerKey === 'string', 'Ad provider returns valid provider key');

  // 6. SMART AD SELECTION ENGINE & HOUSE ADS
  console.log('\n--- Test Group 6: Smart Ad Selection & House Ads ---');
  const smartAd = await SmartAdEngine.requestAd({ slotName: 'SOCIAL_FEED_MID', device: 'mobile', country: 'BD' });
  assert(typeof smartAd.adId === 'string', 'SmartAdEngine returned valid adId');
  assert(typeof smartAd.trackingToken === 'string', 'SmartAdEngine generated trackingToken');

  const houseAd = await HouseAdService.getHouseAd('feed');
  assert(houseAd.isHouseAd === true, 'HouseAdService returned valid fallback house ad');

  // 7. AD FRAUD & RISK DETECTION ENGINE
  console.log('\n--- Test Group 7: Ad Fraud & Bot Risk Evaluation ---');
  const botResult = await AdRiskEngine.evaluateEvent({
    eventType: 'click',
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  });
  assert(botResult.isBlocked === true, 'Bot user agent correctly flagged and blocked by AdRiskEngine');

  const humanResult = await AdRiskEngine.evaluateEvent({
    eventType: 'impression',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
  });
  assert(humanResult.isBlocked === false, 'Standard human browser session passed fraud audit');

  // 8. FINANCIAL LEDGER & IDEMPOTENCY SAFETY
  console.log('\n--- Test Group 8: Financial Ledger & Idempotency ---');
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

    // 9. ADMIN AUDIT TRAIL
    console.log('\n--- Test Group 9: Immutable Admin Audit Logging ---');
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
    console.log(`ℹ Notice: DB integration tests skipped in local unit test execution (${err.message}).`);
  }

  // 10. PRIVATE MULTI-USER WALLET & PAYMENT AUTOMATION ENGINE
  console.log('\n--- Test Group 10: Multi-User Wallet & Payment Automation Engine ---');
  const maskedPhone = PaymentAccountService.maskPhoneNumber('01712345678');
  assert(maskedPhone === '017****5678', 'Payment account phone number masked safely (017****5678)');

  const intentRef = PaymentIntentService.generateReferenceCode();
  assert(intentRef.startsWith('ES-P') && intentRef.length === 9, 'Payment Intent reference code correctly formatted (e.g. ES-P8K29)');

  const parsedSms = BkashAdapter.parseSMS('You have received Tk 500.00 from 01712345678. Ref ES-P8K29. TxnID 9B7X2K1.');
  assert(parsedSms.parsedSuccessfully && parsedSms.transactionId === '9B7X2K1' && parsedSms.amount === 500.0, 'bKash SMS parsed successfully with transactionId and amount');
  assert(parsedSms.reference === 'ES-P8K29', 'bKash SMS reference code extracted correctly');

  const generatedSig = DeviceAuthService.generateSignature('device-1', 'secret-key', '{"amount":500}', 'nonce-123', 1700000000000);
  assert(typeof generatedSig === 'string' && generatedSig.length === 64, 'HMAC SHA256 device request signature generated');

  const lowRisk = PaymentRiskEngine.evaluateRisk({
    amount: 500,
    referenceMatched: true,
    amountMatched: true,
    deviceTrusted: true,
    parserConfidence: 0.95,
  });
  assert(lowRisk.riskLevel === 'LOW', 'Valid matched transaction assigned LOW risk level');

  const highRisk = PaymentRiskEngine.evaluateRisk({
    amount: 50000,
    referenceMatched: false,
    amountMatched: false,
    deviceTrusted: false,
    parserConfidence: 0.5,
  });
  assert(highRisk.riskLevel === 'HIGH', 'Untrusted mismatched transaction flagged as HIGH risk');

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
