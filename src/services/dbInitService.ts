import { prisma } from '@/lib/prisma';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from '@/lib/templates/templateRegistry';
import { hashPassword } from '@/lib/auth';

export class DbInitService {
  /**
   * Auto-initialize database with default system data:
   * 1. Website Templates & Categories
   * 2. Default House Ads
   * 3. Default Payment Accounts (bKash & Nagad)
   * 4. Admin Account & Default Revenue Rules
   */
  static async initializeDatabase() {
    console.log('🔄 Initializing EarnSpace Database Seed & System Defaults...');

    const results = {
      categoriesSeeded: 0,
      templatesSeeded: 0,
      houseAdsSeeded: 0,
      paymentAccountsSeeded: 0,
      adminSeeded: false,
    };

    // 1. Seed Categories
    for (let i = 0; i < TEMPLATE_CATEGORIES.length; i++) {
      const cat = TEMPLATE_CATEGORIES[i];
      await prisma.websiteTemplateCategory.upsert({
        where: { id: cat.id },
        create: {
          id: cat.id,
          slug: cat.id,
          name: cat.name,
          icon: cat.icon,
          order: i,
        },
        update: {
          name: cat.name,
          icon: cat.icon,
          order: i,
        },
      });
      results.categoriesSeeded++;
    }

    // 2. Seed Templates from TEMPLATE_REGISTRY
    for (const t of TEMPLATE_REGISTRY) {
      await prisma.websiteTemplate.upsert({
        where: { slug: t.slug },
        create: {
          id: t.id,
          slug: t.slug,
          name: t.name,
          description: t.description,
          category: t.category,
          subcategory: t.subcategory || 'General',
          style: t.style,
          isPro: t.isPro,
          isFeatured: t.isFeatured || false,
          isPopular: t.isPopular || false,
          isNew: t.isNew || false,
          previewImage: t.previewImage || null,
          schemaJson: JSON.stringify(t.blocks),
          version: 1,
          status: 'published',
        },
        update: {
          name: t.name,
          description: t.description,
          category: t.category,
          subcategory: t.subcategory || 'General',
          style: t.style,
          isPro: t.isPro,
          isFeatured: t.isFeatured || false,
          schemaJson: JSON.stringify(t.blocks),
          status: 'published',
        },
      });
      results.templatesSeeded++;
    }

    // 3. Seed Default House Ads
    const defaultHouseAds = [
      {
        id: 'house_promo_01',
        title: 'Join the EarnSpace Creator Program 🚀',
        description: 'Build your custom personal website, publish reels, and earn 50% ad revenue share!',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
        destinationUrl: '/register',
        ctaText: 'Start Building',
        placement: 'all',
        priority: 1,
      },
      {
        id: 'house_adsterra_01',
        title: 'Exclusive High CPM Bonus Offer ⚡',
        description: 'Click to unlock premium partner rewards and high yield CPM deals.',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200',
        destinationUrl: 'https://www.highratedcpmgate.com/example_smartlink',
        ctaText: 'Claim Offer',
        placement: 'PERSONAL_SPACE_HEADER',
        priority: 2,
      },
    ];

    for (const ad of defaultHouseAds) {
      const existing = await prisma.houseAd.findUnique({ where: { id: ad.id } });
      if (!existing) {
        await prisma.houseAd.create({ data: ad });
        results.houseAdsSeeded++;
      }
    }

    // 4. Seed Default Admin User & Payment Account
    let adminUser = await prisma.user.findFirst({
      where: { accountType: 'BUSINESS' },
    });

    if (!adminUser) {
      adminUser = await prisma.user.findFirst();
    }

    if (adminUser) {
      // Seed Default bKash & Nagad Payment Accounts
      const defaultPaymentAccounts = [
        {
          userId: adminUser.id,
          provider: 'BKASH',
          accountType: 'PERSONAL',
          phoneNumber: '01700000000',
          displayName: 'EarnSpace Official bKash Personal',
          verificationStatus: 'VERIFIED',
          status: 'active',
        },
        {
          userId: adminUser.id,
          provider: 'NAGAD',
          accountType: 'PERSONAL',
          phoneNumber: '01800000000',
          displayName: 'EarnSpace Official Nagad Personal',
          verificationStatus: 'VERIFIED',
          status: 'active',
        },
      ];

      for (const acc of defaultPaymentAccounts) {
        const existing = await prisma.paymentAccount.findFirst({
          where: { provider: acc.provider, phoneNumber: acc.phoneNumber },
        });

        if (!existing) {
          await prisma.paymentAccount.create({ data: acc });
          results.paymentAccountsSeeded++;
        }
      }
    }

    // 5. Seed Admin User Account for Admin Panel
    const existingAdmin = await prisma.adminUser.findFirst();
    if (!existingAdmin) {
      const passHash = await hashPassword('AdminPass2026!');
      await prisma.adminUser.create({
        data: {
          email: 'admin@earnspace.com',
          passwordHash: passHash,
          fullName: 'EarnSpace Super Admin',
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
        },
      });
      results.adminSeeded = true;
    }

    console.log('✅ EarnSpace Database Initialization Completed:', results);
    return results;
  }
}
