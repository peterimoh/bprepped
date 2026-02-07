import { NextResponse } from 'next/server';
import { formatRequestError } from '@/lib/backend/utils/request-error-handler';
import { authService, ForgotPasswordSchema } from '@/lib/backend/services/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = ForgotPasswordSchema.parse(body);

    const result = await authService.requestPasswordReset(validatedData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return formatRequestError(error);
  }
}
