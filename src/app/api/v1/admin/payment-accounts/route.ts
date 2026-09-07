import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getAdminSession, hasAdminPermission } from '@/lib/adminAuth';
import { PaymentAccountService } from '@/services/paymentAccountService';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const accounts = await PaymentAccountService.listAllAccounts();
    return successResponse(accounts);
  } catch (error: any) {
    console.error('GET /api/v1/admin/payment-accounts error:', error);
    return errorResponse(error.message || 'Failed to list payment accounts', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const body = await req.json();
    const { provider, accountType, phoneNumber, displayName, instructions, status } = body;

    if (!provider || !phoneNumber) {
      return errorResponse('Provider (bKash/Nagad etc.) and Phone Number are required', 400);
    }

    const newAccount = await PaymentAccountService.createAccount({
      provider,
      accountType,
      phoneNumber,
      displayName,
      instructions,
      status: status || 'active',
    });

    return successResponse(newAccount, 'Payment account added successfully', 201);
  } catch (error: any) {
    console.error('POST /api/v1/admin/payment-accounts error:', error);
    return errorResponse(error.message || 'Failed to create payment account', 400);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const body = await req.json();
    const { id, provider, accountType, phoneNumber, displayName, instructions, status } = body;

    if (!id) {
      return errorResponse('Account ID is required', 400);
    }

    const updated = await PaymentAccountService.updateAccount(id, {
      provider,
      accountType,
      phoneNumber,
      displayName,
      instructions,
      status,
    });

    return successResponse(updated, 'Payment account updated successfully');
  } catch (error: any) {
    console.error('PUT /api/v1/admin/payment-accounts error:', error);
    return errorResponse(error.message || 'Failed to update payment account', 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Account ID is required', 400);
    }

    const toggled = await PaymentAccountService.toggleAccountStatus(id);
    return successResponse(toggled, `Payment account status changed to ${toggled.status}`);
  } catch (error: any) {
    console.error('PATCH /api/v1/admin/payment-accounts error:', error);
    return errorResponse(error.message || 'Failed to toggle account status', 400);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) return errorResponse('Unauthorized admin access', 401);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('Account ID is required', 400);
    }

    await PaymentAccountService.deleteAccount(id);
    return successResponse(null, 'Payment account deleted successfully');
  } catch (error: any) {
    console.error('DELETE /api/v1/admin/payment-accounts error:', error);
    return errorResponse(error.message || 'Failed to delete payment account', 400);
  }
}
