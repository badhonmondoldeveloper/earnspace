import { prisma } from '@/lib/prisma';

export async function saveDraft(data: {
  userId: string;
  type: 'post' | 'blog' | 'video' | 'reel';
  title?: string;
  content?: string;
  mediaJson?: string;
  metadataJson?: string;
}) {
  return prisma.contentDraft.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      content: data.content,
      mediaJson: data.mediaJson || '[]',
      metadataJson: data.metadataJson || '{}',
    },
  });
}

export async function getUserDrafts(userId: string) {
  return prisma.contentDraft.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function deleteDraft(id: string, userId: string) {
  return prisma.contentDraft.deleteMany({
    where: { id, userId },
  });
}

