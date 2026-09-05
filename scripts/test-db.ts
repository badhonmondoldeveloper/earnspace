import { PrismaClient } from '@prisma/client';

async function testUrl(url: string, label: string) {
  console.log(`\nTesting ${label}...`);
  const prisma = new PrismaClient({
    datasources: {
      db: { url },
    },
  });

  try {
    const userCount = await prisma.user.count();
    console.log(`✅ SUCCESS: Connected to ${label}! User count = ${userCount}`);
    await prisma.$disconnect();
    return true;
  } catch (err: any) {
    console.error(`❌ FAILED: ${label} - ${err.message}`);
    await prisma.$disconnect();
    return false;
  }
}

async function main() {
  const tests = [
    { label: 'Pooler 6543 postgres.xwczzmlwjincmccopgha:badhon2006', url: 'postgresql://postgres.xwczzmlwjincmccopgha:badhon2006@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require' },
    { label: 'Pooler 6543 postgres.xwczzmlwjincmccopgha:<dev>badhon2006', url: 'postgresql://postgres.xwczzmlwjincmccopgha:%3Cdev%3Ebadhon2006@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require' },
    { label: 'Pooler 6543 postgres.xwczzmlwjincmccopgha:<dev>', url: 'postgresql://postgres.xwczzmlwjincmccopgha:%3Cdev%3E@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require' },
    { label: 'Pooler 5432 postgres.xwczzmlwjincmccopgha:<dev>badhon2006', url: 'postgresql://postgres.xwczzmlwjincmccopgha:%3Cdev%3Ebadhon2006@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require' },
  ];

  for (const t of tests) {
    await testUrl(t.url, t.label);
  }
}

main();

