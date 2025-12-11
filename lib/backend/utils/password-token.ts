import { v6 as uuidV6 } from 'uuid';
import { prisma } from '@/lib/prisma';

export async function generateResetToken(email: string) {
  const token = uuidV6();

  // token expires in 5 minutes
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  return await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}
