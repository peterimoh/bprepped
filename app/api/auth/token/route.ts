import { NextResponse } from 'next/server';
import { formatRequestError } from '@/lib/backend/utils/request-error-handler';
import { authService, VerifyTokenSchema } from '@/lib/backend/services/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = VerifyTokenSchema.parse(body);

    const result = await authService.verifyResetToken(validatedData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return formatRequestError(error);
  }
}
