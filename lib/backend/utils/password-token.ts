import { v6 as uuidV6 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function generateResetToken(email: string) {
  const token = uuidV6();
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  return prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}
