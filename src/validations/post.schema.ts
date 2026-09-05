import { z } from 'zod';

export const postCreateSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty').max(3000, 'Post content cannot exceed 3000 characters'),
  type: z.enum(['text', 'image', 'video', 'link', 'article']).default('text'),
  visibility: z.enum(['public', 'followers', 'private']).default('public'),
  mediaUrls: z.array(z.string().url()).optional(),
});

export const commentCreateSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1, 'Comment cannot be empty').max(1000),
  parentId: z.string().optional(),
});

