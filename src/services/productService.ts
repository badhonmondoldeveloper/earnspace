import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export interface CreateProductInput {
  sellerId: string;
  title: string;
  description?: string;
  price: number;
  currency?: string;
  fileUrl?: string;
  isDigital?: boolean;
  categoryId?: string;
}

export class ProductService {
  static async createProduct(input: CreateProductInput) {
    if (input.price < 0) {
      throw new Error('Product price cannot be negative');
    }

    const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`;

    return prisma.product.create({
      data: {
        sellerId: input.sellerId,
        title: input.title,
        slug,
        description: input.description,
        price: input.price,
        currency: input.currency || 'BDT',
        fileUrl: input.fileUrl,
        isDigital: input.isDigital ?? true,
        categoryId: input.categoryId,
        status: 'active',
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        category: true,
      },
    });
  }

  static async getProducts(filters?: {
    sellerId?: string;
    categoryId?: string;
    search?: string;
    limit?: number;
  }) {
    const limit = filters?.limit || 20;

    return prisma.product.findMany({
      where: {
        status: 'active',
        ...(filters?.sellerId ? { sellerId: filters.sellerId } : {}),
        ...(filters?.categoryId ? { categoryId: filters.categoryId } : {}),
        ...(filters?.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  static async getProductBySlugOrId(idOrSlug: string) {
    return prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
        category: true,
      },
    });
  }

  static async purchaseProduct(buyerId: string, productId: string, paymentMethod = 'WALLET') {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product || product.status !== 'active') {
        throw new Error('Product not available for purchase');
      }

      if (product.sellerId === buyerId) {
        throw new Error('You cannot purchase your own product');
      }

      // Record Order
      const order = await tx.order.create({
        data: {
          buyerId,
          totalAmount: product.price,
          currency: product.currency,
          status: 'completed',
          paymentMethod,
          paymentRef: `ord_${Date.now()}_${buyerId.slice(0, 6)}`,
        },
      });

      // Record Order Item
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          price: product.price,
          quantity: 1,
        },
      });

      // Digital Delivery Link
      let delivery = null;
      if (product.isDigital && product.fileUrl) {
        delivery = await tx.digitalDelivery.create({
          data: {
            orderId: order.id,
            productId: product.id,
            downloadUrl: product.fileUrl,
          },
        });
      }

      // Credit Seller Wallet (90% seller share, 10% platform share)
      const platformFeeRate = 0.1;
      const sellerShare = Math.round(product.price * (1 - platformFeeRate) * 100) / 100;

      const wallet = await FinancialLedgerService.getOrCreateWallet(product.sellerId, tx);
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: wallet.availableBalance + sellerShare,
          lifetimeEarned: wallet.lifetimeEarned + sellerShare,
        },
      });

      await FinancialLedgerService.recordTransaction({
        userId: product.sellerId,
        type: 'product_sale',
        amount: sellerShare,
        currency: product.currency,
        referenceType: 'order_id',
        referenceId: order.id,
        idempotencyKey: `prod_sale_${order.id}`,
        description: `Sale of digital product: ${product.title}`,
      });

      // Increment sales count
      await tx.product.update({
        where: { id: product.id },
        data: { salesCount: { increment: 1 } },
      });

      return {
        order,
        delivery,
      };
    });
  }
}
