import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'badhonmondoldeveloper@gmail.com';
  const password = 'badhon#2006';
  const passwordHash = await bcrypt.hash(password, 10);

  console.log(`Seeding admin and user accounts for ${email}...`);

  // 1. Seed AdminUser
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'Super Admin',
      status: 'active',
      fullName: 'Badhon Mondol',
    },
    create: {
      email,
      fullName: 'Badhon Mondol',
      passwordHash,
      role: 'Super Admin',
      status: 'active',
    },
  });

  console.log(`✅ AdminUser created/updated successfully: ID=${admin.id}, Email=${admin.email}, Role=${admin.role}`);

  // 2. Seed User
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      status: 'active',
    },
    create: {
      username: 'badhondev',
      email,
      passwordHash,
      status: 'active',
      profile: {
        create: {
          fullName: 'Badhon Mondol',
          bio: 'Creator & Founder of EarnSpace',
        },
      },
      settings: {
        create: {
          notificationEmail: true,
          notificationPush: true,
        },
      },
    },
  });

  console.log(`✅ User account created/updated successfully: ID=${user.id}, Username=${user.username}`);

  // Ensure user has wallet
  const existingWallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
  });
  if (!existingWallet) {
    await prisma.wallet.create({
      data: {
        userId: user.id,
        availableBalance: 100.0,
        currency: 'USD',
      },
    });
    console.log(`✅ Wallet created with $100.00 available balance`);
  }
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

