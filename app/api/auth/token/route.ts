import { NextResponse } from 'next/server';
import {
  formatRequestError,
  NotFoundError,
  CustomError,
} from '@/lib/backend/utils';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const validationSchema = z.object({
  token: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validationSchema.parse(body);

    const token = await prisma.passwordResetToken.findFirst({
      where: { token: data.token },
    });

    if (!token) {
      throw new NotFoundError('token not found');
    }

    if (token.expires < new Date()) {
      throw new CustomError('ExpiredTokenError', 'BAD_REQUEST', 'expired');
    }

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e) {
    return formatRequestError(e);
  }
}
