import { z } from 'zod';

export const blockSaveSchema = z.object({
  type: z.enum(['hero', 'text', 'image', 'video', 'blog', 'social', 'gallery', 'links', 'contact', 'cta']),
  position: z.number().int().min(0),
  contentJson: z.string(),
  visibility: z.boolean().default(true),
});

export const pageSettingsSchema = z.object({
  theme: z.enum(['modern', 'minimalist', 'dark', 'elegant', 'cyberpunk']).default('modern'),
  typography: z.string().default('sans'),
  colorsJson: z.string().default('{}'),
  layout: z.string().default('single-column'),
});

