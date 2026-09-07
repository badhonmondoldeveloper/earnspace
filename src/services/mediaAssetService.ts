import { prisma } from '@/lib/prisma';
import { storageService } from './storageService';
import { validateFileUpload } from '@/lib/uploadSanitizer';

export interface CreateMediaAssetInput {
  userId: string;
  fileBuffer: Buffer;
  originalName: string;
  mimeType: string;
  purpose?: string;
  folderId?: string;
  altText?: string;
}

export interface ListMediaAssetsQuery {
  userId: string;
  folderId?: string;
  fileType?: string; // image, video, audio, document
  purpose?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class MediaAssetService {
  /**
   * Upload file, sanitize/validate magic bytes, upload to storage, and record in DB.
   */
  static async uploadAsset(input: CreateMediaAssetInput) {
    const { userId, fileBuffer, originalName, mimeType, purpose = 'general', folderId, altText } = input;

    // Validate size & magic bytes (allow up to 50MB for video, 10MB for image)
    const maxSize = purpose === 'video' || mimeType.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    const validation = validateFileUpload(fileBuffer, originalName, mimeType, maxSize);
    
    if (!validation.valid) {
      throw new Error(`Upload validation failed: ${validation.error}`);
    }

    // Determine detected file type
    const detectedType = mimeType.startsWith('image/')
      ? 'image'
      : mimeType.startsWith('video/')
      ? 'video'
      : mimeType.startsWith('audio/')
      ? 'audio'
      : 'document';

    // Determine target folder if specified
    if (folderId) {
      const folder = await prisma.mediaFolder.findFirst({
        where: { id: folderId, userId },
      });
      if (!folder) {
        throw new Error('Target folder not found or unauthorized');
      }
    }

    // Store file
    const url = await storageService.uploadFile(fileBuffer, originalName, mimeType);

    // Save asset record
    const asset = await prisma.mediaAsset.create({
      data: {
        userId,
        folderId: folderId || null,
        name: originalName,
        url,
        fileType: detectedType,
        mimeType,
        fileSize: fileBuffer.length,
        purpose,
        altText: altText || originalName,
      },
    });

    return asset;
  }

  /**
   * Get user's media assets with pagination and filters
   */
  static async listAssets(query: ListMediaAssetsQuery) {
    const { userId, folderId, fileType, purpose, search, page = 1, limit = 24 } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (folderId === 'root') {
      where.folderId = null;
    } else if (folderId) {
      where.folderId = folderId;
    }

    if (fileType && fileType !== 'all') {
      where.fileType = fileType;
    }

    if (purpose && purpose !== 'all') {
      where.purpose = purpose;
    }

    if (search && search.trim()) {
      where.name = { contains: search.trim(), mode: 'insensitive' };
    }

    const [assets, total, totalStorage] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          folder: { select: { id: true, name: true } },
          usages: true,
        },
      }),
      prisma.mediaAsset.count({ where }),
      prisma.mediaAsset.aggregate({
        where: { userId },
        _sum: { fileSize: true },
      }),
    ]);

    return {
      assets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      storageUsedBytes: totalStorage._sum.fileSize || 0,
    };
  }

  /**
   * Delete asset with safe usage checking
   */
  static async deleteAsset(assetId: string, userId: string, force = false) {
    const asset = await prisma.mediaAsset.findFirst({
      where: { id: assetId, userId },
      include: { usages: true },
    });

    if (!asset) {
      throw new Error('Media asset not found or unauthorized');
    }

    if (asset.usages.length > 0 && !force) {
      return {
        success: false,
        inUse: true,
        usageCount: asset.usages.length,
        usages: asset.usages,
        message: `This asset is currently in use across ${asset.usages.length} locations.`,
      };
    }

    // Try deleting from storage provider
    await storageService.deleteFile(asset.url);

    // Delete DB record
    await prisma.mediaAsset.delete({
      where: { id: assetId },
    });

    return {
      success: true,
      inUse: false,
      message: 'Asset successfully deleted',
    };
  }

  /**
   * Track asset usage (when added to page block, post, ad creative, profile avatar, etc.)
   */
  static async recordUsage(assetId: string, entityType: string, entityId: string, field?: string) {
    const existing = await prisma.mediaUsage.findFirst({
      where: { assetId, entityType, entityId, field },
    });

    if (!existing) {
      await prisma.mediaUsage.create({
        data: { assetId, entityType, entityId, field },
      });
      await prisma.mediaAsset.update({
        where: { id: assetId },
        data: { usageCount: { increment: 1 } },
      });
    }
  }

  /**
   * Remove asset usage (when removed from page block, post, ad creative, profile avatar, etc.)
   */
  static async removeUsage(assetId: string, entityType: string, entityId: string, field?: string) {
    const usage = await prisma.mediaUsage.findFirst({
      where: { assetId, entityType, entityId, field },
    });

    if (usage) {
      await prisma.mediaUsage.delete({ where: { id: usage.id } });
      await prisma.mediaAsset.update({
        where: { id: assetId },
        data: { usageCount: { decrement: 1 } },
      });
    }
  }

  /**
   * Create or fetch media folders
   */
  static async createFolder(userId: string, name: string, color = '#6366f1', parentId?: string) {
    return prisma.mediaFolder.create({
      data: {
        userId,
        name,
        color,
        parentId: parentId || null,
      },
    });
  }

  static async listFolders(userId: string) {
    return prisma.mediaFolder.findMany({
      where: { userId },
      include: {
        _count: { select: { assets: true } },
      },
      orderBy: { name: 'asc' },
    });
  }
}
