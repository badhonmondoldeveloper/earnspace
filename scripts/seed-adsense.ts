import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const publisherId = 'ca-pub-9249570729862532';
  const headCodeSnippet = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}" crossorigin="anonymous"></script>\n<meta name="google-adsense-account" content="${publisherId}">`;
  const adCodeSnippet = `<ins class="adsbygoogle" style="display:block" data-ad-client="${publisherId}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;

  const provider = await prisma.adProvider.upsert({
    where: { providerKey: 'google_adsense' },
    update: {
      name: 'Google AdSense',
      providerType: 'google_adsense',
      status: 'active',
      priority: 1,
      credentialsJson: JSON.stringify({ publisherId, autoAdsEnabled: true }),
      headCodeSnippet,
      adCodeSnippet,
      healthStatus: 'healthy',
    },
    create: {
      name: 'Google AdSense',
      providerKey: 'google_adsense',
      providerType: 'google_adsense',
      status: 'active',
      priority: 1,
      placementsJson: JSON.stringify(['feed', 'video', 'reels', 'blog', 'sidebar']),
      supportedFormatsJson: JSON.stringify(['banner', 'native', 'auto_ads']),
      supportedDevicesJson: JSON.stringify(['mobile', 'desktop', 'tablet']),
      supportedCountriesJson: JSON.stringify(['BD', 'GLOBAL']),
      credentialsJson: JSON.stringify({ publisherId, autoAdsEnabled: true }),
      headCodeSnippet,
      adCodeSnippet,
      healthStatus: 'healthy',
    },
  });

  console.log('✅ Google AdSense Provider configured successfully:');
  console.log('   ID:', provider.id);
  console.log('   Publisher ID:', publisherId);
  console.log('   Status:', provider.status);
  console.log('   Head Script:', provider.headCodeSnippet);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
