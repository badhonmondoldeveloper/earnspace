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

  return {
    title: `${user.profile?.fullName || user.username}'s Personal Website — EarnSpace`,
    description: user.profile?.bio || `Explore ${user.profile?.fullName || user.username}'s official digital space on EarnSpace.`,
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
