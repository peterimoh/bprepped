import { NextResponse } from 'next/server';
import {
  formatRequestError,
  generateResetToken,
  InternalServerError,
} from '@/lib/backend/utils';
import { prisma } from '@/lib/prisma';
import notification from '@/lib/notification';
import { z } from 'zod';

const validationSchema = z.object({
  email: z.string().email().trim(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = validationSchema.parse(body);

    const user = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (user) {
      const { token } = await generateResetToken(user.email as string);
      if (!token) throw new InternalServerError('Request Failed');

      const urlBuilder = `${process.env.APP_URL}/password-reset?token=${token}`;

      await notification.sendEmail({
        to: user.email as string,
        subject: 'Password Reset',
        markdown: `
Hello **${user.fullName?.split(' ')[0]}**,

You recently requested to reset your password for your account. Click the link below to reset your password:

[Reset Your Password](${urlBuilder})

This link will expire in **5 minutes** for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

If you're concerned about the security of your account, we recommend:
- Logging into your account directly
- Updating your password immediately

Thank you for using our service!

Best regards.
        `,
      });
    }

    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (e) {
    return formatRequestError(e);
  }
}
