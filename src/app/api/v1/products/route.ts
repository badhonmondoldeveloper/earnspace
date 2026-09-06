import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { ProductService } from '@/services/productService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get('sellerId') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;

    const products = await ProductService.getProducts({
      sellerId,
      categoryId,
      search,
      limit,
    });

    return successResponse(products, 'Products retrieved successfully');
  } catch (error: any) {
    console.error('GET /api/v1/products error:', error);
    return errorResponse(error.message || 'Failed to fetch products', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { title, description, price, currency, fileUrl, isDigital, categoryId } = body;

    if (!title || price === undefined) {
      return errorResponse('Title and price are required fields', 400);
    }

    const product = await ProductService.createProduct({
      sellerId: session.userId,
      title,
      description,
      price: parseFloat(price),
      currency: currency || 'BDT',
      fileUrl,
      isDigital,
      categoryId,
    });

    return successResponse(product, 'Product created successfully', 201);
  } catch (error: any) {
    console.error('POST /api/v1/products error:', error);
    return errorResponse(error.message || 'Failed to create product', 500);
  }
}
