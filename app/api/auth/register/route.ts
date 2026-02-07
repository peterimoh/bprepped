import { NextResponse } from 'next/server';
import { formatRequestError } from '@/lib/backend/utils/request-error-handler';
import { authService, RegistrationSchema } from '@/lib/backend/services/auth-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = RegistrationSchema.parse(body);

    const user = await authService.register(validatedData);

    return NextResponse.json(
      {
        message: 'Registration successful',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return formatRequestError(error);
  }
}
