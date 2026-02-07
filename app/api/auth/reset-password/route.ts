import { NextResponse } from 'next/server';
import { formatRequestError } from '@/lib/backend/utils/request-error-handler';
import {
  authService,
  ResetPasswordSchema,
} from '@/lib/backend/services/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ResetPasswordSchema.parse(body);

    const result = await authService.resetPassword(validatedData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return formatRequestError(error);
  }
}
