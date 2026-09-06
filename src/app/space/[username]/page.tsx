import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PersonalSpaceClientContainer } from '@/components/space/PersonalSpaceClientContainer';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase();
  const user = await prisma.user.findFirst({
    where: { username },
    include: { profile: true },
  });

  if (!user) return { title: 'Space Not Found' };

  const fullName = user.profile?.fullName || user.username;
  const bio = user.profile?.bio || `Welcome to ${fullName}'s official EarnSpace digital space and blog website.`;
  const avatar = user.profile?.avatar || 'https://earnspace-chi.vercel.app/og-default.png';
  const url = `https://earnspace-chi.vercel.app/space/${user.username}`;

  return {
    title: `${fullName} — Official Digital Space & Blog`,
    description: bio,
    other: {
      'google-adsense-account': 'ca-pub-9249570729862532',
    },
    openGraph: {
      title: `${fullName} — Official Digital Space & Blog`,
      description: bio,
      url,
      siteName: 'EarnSpace',
      images: [
        {
          url: avatar,
          width: 800,
          height: 800,
          alt: fullName,
        },
      ],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullName} — Official Digital Space & Blog`,
      description: bio,
      images: [avatar],
    },
  };
}

export default async function PersonalWebsitePage({ params }: { params: { username: string } }) {
  const username = params.username.toLowerCase();

  const user = await prisma.user.findFirst({
    where: { username },
    include: {
      profile: true,
      posts: {
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
        include: { media: true, reactions: true, comments: true },
      },
      reels: {
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
      },
      videos: {
        where: { status: 'published' },
        orderBy: { createdAt: 'desc' },
      },
      blogs: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
      },
      stories: {
        where: { expiresAt: { gt: new Date() } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Find page builder configuration if exists
  const page = await prisma.page.findFirst({
    where: { userId: user.id },
    include: {
      blocks: { where: { visibility: true }, orderBy: { position: 'asc' } },
      settings: true,
    },
  });

  return (
    <PersonalSpaceClientContainer
      page={page}
      user={user}
      profile={user.profile}
      posts={user.posts || []}
      reels={user.reels || []}
      videos={user.videos || []}
      blogs={user.blogs || []}
      stories={user.stories || []}
      blocks={page?.blocks || []}
      settings={page?.settings || { theme: 'modern' }}
    />
  );
}
