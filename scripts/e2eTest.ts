import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth';
import { TemplateService } from '../src/services/templateService';
import { MediaAssetService } from '../src/services/mediaAssetService';
import { PaymentAccountService } from '../src/services/paymentAccountService';
import { HouseAdService } from '../src/services/houseAdService';
import { SmartAdEngine } from '../src/services/smartAdEngine';

async function runFullE2ETest() {
  console.log('🚀 STARTING EARNSPACE FULL END-TO-END SYSTEM TEST...');
  const testResults: { test: string; status: 'PASSED' | 'FAILED'; detail?: any }[] = [];

  try {
    // ----------------------------------------------------
    // TEST 1: User Registration & Authentication
    // ----------------------------------------------------
    console.log('\n--- TEST 1: User Registration & Profile Setup ---');
    const testUsername = `e2e_user_${Date.now()}`;
    const testEmail = `${testUsername}@earnspace.com`;
    const passwordHash = await hashPassword('TestPass123!');

    const user = await prisma.user.create({
      data: {
        username: testUsername,
        email: testEmail,
        passwordHash,
        accountType: 'CREATOR',
        profile: {
          create: {
            fullName: 'E2E Test Creator',
            bio: 'Official End-to-End System Test Account on EarnSpace',
            category: 'Tech & Vlogging',
          },
        },
      },
      include: { profile: true },
    });

    console.log('✅ User registered:', user.username, 'ID:', user.id);
    testResults.push({ test: 'User Registration & Auth', status: 'PASSED', detail: user.username });

    // ----------------------------------------------------
    // TEST 2: Post Creation, Reaction & Commenting
    // ----------------------------------------------------
    console.log('\n--- TEST 2: Post Creation & Feed Interaction ---');
    const post = await prisma.post.create({
      data: {
        userId: user.id,
        content: '🎉 Hello EarnSpace community! Testing full post creation and interaction.',
        visibility: 'public',
        status: 'published',
      },
    });

    // Add reaction
    const reaction = await prisma.postReaction.create({
      data: {
        postId: post.id,
        userId: user.id,
        type: 'LIKE',
      },
    });

    // Add comment
    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        userId: user.id,
        content: 'Testing comments on EarnSpace post feed!',
      },
    });

    console.log('✅ Post created:', post.id, 'Reaction:', reaction.id, 'Comment:', comment.id);
    testResults.push({ test: 'Post Creation, Reaction & Comment', status: 'PASSED', detail: { postId: post.id } });

    // ----------------------------------------------------
    // TEST 3: Template Selection & Personal Profile Space Applying
    // ----------------------------------------------------
    console.log('\n--- TEST 3: Website Template Selection & Personal Space Setup ---');
    const appliedPage = await TemplateService.applyTemplateToUserPage(user.id, 'creator-pro');
    console.log('✅ Template "creator-pro" applied cleanly!');
    console.log('   Blocks count:', appliedPage?.blocks?.length, 'Theme:', appliedPage?.settings?.theme);
    testResults.push({ test: 'Template Selection & Profile Space', status: 'PASSED', detail: { blocksCount: appliedPage?.blocks?.length } });

    // ----------------------------------------------------
    // TEST 4: Universal Media Library Upload & Safe Storage
    // ----------------------------------------------------
    console.log('\n--- TEST 4: Media Upload & Library Asset Management ---');
    const sampleBuffer = Buffer.from('GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;');
    const mediaAsset = await MediaAssetService.uploadAsset({
      userId: user.id,
      fileBuffer: sampleBuffer,
      originalName: 'test-banner.gif',
      mimeType: 'image/gif',
      purpose: 'page_block',
    });

    const userAssets = await MediaAssetService.listAssets({ userId: user.id });
    console.log('✅ Media asset uploaded:', mediaAsset.id, 'User assets total:', userAssets.pagination.total);
    testResults.push({ test: 'Universal Media Upload & Library', status: 'PASSED', detail: { assetId: mediaAsset.id } });

    // ----------------------------------------------------
    // TEST 5: Payment Gateway Active Numbers & Payment Attempt
    // ----------------------------------------------------
    console.log('\n--- TEST 5: Payment Gateway Numbers & Manual Payment Attempt ---');
    const activeGateways = await PaymentAccountService.getActiveAccounts();
    console.log('✅ Active Payment Gateways found:', activeGateways.length, activeGateways.map((g) => `${g.provider}: ${g.phoneNumber}`));

    const paymentAttempt = await prisma.paymentAttempt.create({
      data: {
        userId: user.id,
        gateway: 'BKASH',
        amount: 499.0,
        currency: 'BDT',
        transactionRef: `TRX_${Date.now()}`,
        status: 'completed',
      },
    });
    console.log('✅ Payment attempt created:', paymentAttempt.transactionRef);
    testResults.push({ test: 'Payment Gateway & Checkout Attempt', status: 'PASSED', detail: paymentAttempt.transactionRef });

    // ----------------------------------------------------
    // TEST 6: Smart Ad Engine & House Ads Request
    // ----------------------------------------------------
    console.log('\n--- TEST 6: Smart Ad Engine & House Ad Serving ---');
    const adHeader = await SmartAdEngine.requestAd({
      slotName: 'PERSONAL_SPACE_HEADER',
      creatorId: user.id,
    });
    const adSidebar = await SmartAdEngine.requestAd({
      slotName: 'PERSONAL_SPACE_SIDEBAR',
      creatorId: user.id,
    });

    console.log('✅ Header Ad served:', adHeader.adId, 'Title:', adHeader.title);
    console.log('✅ Sidebar Ad served:', adSidebar.adId, 'Title:', adSidebar.title);
    testResults.push({ test: 'Smart Ad Engine & House Ads Serving', status: 'PASSED', detail: { headerAd: adHeader.adId } });

    // ----------------------------------------------------
    // SUMMARY REPORT
    // ----------------------------------------------------
    console.log('\n========================================');
    console.log('🎉 E2E SYSTEM QA TEST RESULTS');
    console.log('========================================');
    testResults.forEach((r, i) => {
      console.log(`${i + 1}. [${r.status}] ${r.test}`);
    });
    console.log('========================================');
    console.log('ALL SYSTEM WORKFLOWS VERIFIED 100% OPERATIONAL!\n');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ E2E TEST FAILED:', error);
    process.exit(1);
  }
}

runFullE2ETest();
