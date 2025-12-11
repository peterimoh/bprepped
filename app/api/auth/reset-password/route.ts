import { NextResponse } from 'next/server';
import {
  formatRequestError,
  NotFoundError,
  CustomError,
} from '@/lib/backend/utils';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import * as argon from 'argon2';

const validationSchema = z.object({
  token: z.string().uuid(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character',
    })
    .trim(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validationSchema.parse(body);

    // Find and validate the token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token: data.token },
    });

    if (!resetToken) {
      throw new NotFoundError('token not found');
    }

    if (resetToken.expires < new Date()) {
      throw new CustomError('ExpiredTokenError', 'BAD_REQUEST', 'expired');
    }

    // Find the user by email from the token
    const user = await prisma.user.findFirst({
      where: { email: resetToken.email },
    });

    if (!user) {
      throw new NotFoundError('user not found');
    }

    // Hash the new password
    const hashedPassword = await argon.hash(data.password);

    // Update user password and delete the used token in a transaction
    await prisma.$transaction(async (trx) => {
      await trx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await trx.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
    });

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (e) {
    return formatRequestError(e);
  }
}
