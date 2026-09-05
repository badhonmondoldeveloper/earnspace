import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export function successResponse<T>(data: T, message = 'Success', status = 200) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    errors: [],
  };
  return NextResponse.json(response, { status });
}

export function errorResponse(message = 'An error occurred', status = 400, errors: Array<{ field?: string; message: string }> = []) {
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    errors,
  };
  return NextResponse.json(response, { status });
}

