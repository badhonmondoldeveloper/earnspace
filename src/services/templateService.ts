import { prisma } from '@/lib/prisma';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES, TemplateDefinition } from '@/lib/templates/templateRegistry';

export interface TemplateQueryFilter {
  category?: string;
  subcategory?: string;
  search?: string;
  style?: string;
  isPro?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  limit?: number;
  offset?: number;
}

export class TemplateService {
  /**
   * Retrieves templates with fallback to predefined template registry
   */
  static async getTemplates(filter: TemplateQueryFilter = {}) {
    const { category, subcategory, search, style, isPro, isFeatured, isPopular, limit = 20 } = filter;

    try {
      // Attempt DB query first
      const whereClause: any = { status: 'published' };
      if (category && category !== 'all') {
        whereClause.category = { equals: category, mode: 'insensitive' };
      }
      if (subcategory) {
        whereClause.subcategory = { equals: subcategory, mode: 'insensitive' };
      }
      if (style) {
        whereClause.style = { equals: style, mode: 'insensitive' };
      }
      if (isPro !== undefined) {
        whereClause.isPro = isPro;
      }
      if (isFeatured) {
        whereClause.isFeatured = true;
      }
      if (isPopular) {
        whereClause.isPopular = true;
      }
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { subcategory: { contains: search, mode: 'insensitive' } },
        ];
      }

      const dbTemplates = await prisma.websiteTemplate.findMany({
        where: whereClause,
        orderBy: [{ isFeatured: 'desc' }, { usesCount: 'desc' }, { createdAt: 'desc' }],
        take: limit,
      });

      if (dbTemplates.length > 0) {
        return dbTemplates;
      }
    } catch (err) {
      console.warn('TemplateService DB query fallback to registry:', err);
    }

    // Fallback to in-memory Template Registry
    let list = [...TEMPLATE_REGISTRY];
    if (category && category !== 'all') {
      const catClean = category.toLowerCase();
      list = list.filter((t) => t.category.toLowerCase().includes(catClean) || catClean.includes(t.category.toLowerCase()));
    }
    if (subcategory) {
      const subClean = subcategory.toLowerCase();
      list = list.filter((t) => t.subcategory.toLowerCase().includes(subClean));
    }
    if (style) {
      list = list.filter((t) => t.style.toLowerCase() === style.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.subcategory.toLowerCase().includes(q)
      );
    }
    if (isFeatured) {
      list = list.filter((t) => t.isFeatured);
    }

    return list.slice(0, limit);
  }

  /**
   * Retrieves single template definition by slug or ID
   */
  static async getTemplateBySlug(slug: string): Promise<TemplateDefinition | null> {
    try {
      const dbTemp = await prisma.websiteTemplate.findUnique({
        where: { slug },
      });

      if (dbTemp) {
        return {
          id: dbTemp.id,
          slug: dbTemp.slug,
          name: dbTemp.name,
          description: dbTemp.description || '',
          category: dbTemp.category,
          subcategory: dbTemp.subcategory || '',
          style: (dbTemp.style as any) || 'Modern',
          isPro: dbTemp.isPro,
          isFeatured: dbTemp.isFeatured,
          isPopular: dbTemp.isPopular,
          isNew: dbTemp.isNew,
          previewImage: dbTemp.previewImage || undefined,
          themePreset: 'modern',
          blocks: dbTemp.schemaJson ? JSON.parse(dbTemp.schemaJson) : [],
        };
      }
    } catch (err) {
      console.warn('getTemplateBySlug DB error, using registry:', err);
    }

    const matched = TEMPLATE_REGISTRY.find((t) => t.slug === slug || t.id === slug);
    return matched || null;
  }

  /**
   * Calculates template recommendation match scores based on user survey answers
   */
  static getRecommendedTemplates(survey: { doWhat?: string; goal?: string; style?: string }) {
    const { doWhat = '', goal = '', style = '' } = survey;

    return TEMPLATE_REGISTRY.map((t) => {
      let score = 50;

      // Profession match
      if (doWhat && (t.category.toLowerCase().includes(doWhat.toLowerCase()) || t.subcategory.toLowerCase().includes(doWhat.toLowerCase()))) {
        score += 30;
      }
      // Style match
      if (style && t.style.toLowerCase() === style.toLowerCase()) {
        score += 15;
      }
      // Featured / Popular boost
      if (t.isFeatured) score += 10;
      if (t.isPopular) score += 5;

      return { template: t, matchScore: Math.min(score, 99) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Applies template to user's page with auto-fill from EarnSpace Profile
   */
  static async applyTemplateToUserPage(userId: string, templateSlug: string) {
    const template = await this.getTemplateBySlug(templateSlug);
    if (!template) {
      throw new Error(`Template "${templateSlug}" not found`);
    }

    // Fetch user profile data for auto-fill
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    const userProfile = user?.profile;
    const displayName = userProfile?.fullName || user?.username || 'Creator';
    const bio = userProfile?.bio || 'Building my personal digital space on EarnSpace.';

    return prisma.$transaction(async (tx) => {
      // Find or create Page
      let page = await tx.page.findFirst({
        where: { userId },
      });

      if (!page) {
        page = await tx.page.create({
          data: {
            userId,
            slug: user?.username || `space-${Date.now()}`,
            title: `${displayName}'s Space`,
            description: bio,
          },
        });
      }

      // Delete existing blocks
      await tx.pageBlock.deleteMany({
        where: { pageId: page.id },
      });

      // Create new blocks from template schema with profile auto-fill
      const blocksToCreate = template.blocks.map((b, index) => {
        const content = { ...b.content };

        // Auto-fill Hero block
        if (b.type === 'hero') {
          content.title = content.title || `Welcome to ${displayName}'s Space`;
          content.subtitle = bio || content.subtitle;
        }

        return {
          pageId: page.id,
          type: b.type,
          position: index,
          contentJson: JSON.stringify(content),
          visibility: true,
        };
      });

      await tx.pageBlock.createMany({
        data: blocksToCreate,
      });

      // Update PageSetting
      await tx.pageSetting.upsert({
        where: { pageId: page.id },
        create: {
          pageId: page.id,
          templateId: template.id,
          theme: template.themePreset || 'modern',
        },
        update: {
          templateId: template.id,
          theme: template.themePreset || 'modern',
        },
      });

      return tx.page.findUnique({
        where: { id: page.id },
        include: {
          blocks: { orderBy: { position: 'asc' } },
          settings: true,
        },
      });
    });
  }
}
