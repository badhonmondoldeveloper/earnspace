import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { ProductService } from '@/services/productService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { productId, paymentMethod } = body;

    if (!productId) {
      return errorResponse('productId is required', 400);
    }

    const result = await ProductService.purchaseProduct(
      session.userId,
      productId,
      paymentMethod || 'WALLET'
    );

    return successResponse(result, 'Product purchased successfully');
  } catch (error: any) {
    console.error('POST /api/v1/products/purchase error:', error);
    return errorResponse(error.message || 'Failed to purchase product', 400);
  }
}
