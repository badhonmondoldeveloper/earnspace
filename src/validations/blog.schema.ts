import { z } from 'zod';

export const blogCreateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  coverImage: z.string().url().or(z.literal('')).optional(),
  content: z.string().min(10, 'Article content must be at least 10 characters'),
  excerpt: z.string().max(300).optional(),
  category: z.string().default('General'),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('published'),
});

