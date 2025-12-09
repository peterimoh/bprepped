import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import * as argon from 'argon2';
import { Roles } from '@/lib/types';
import notificationService from '@/lib/notification';

const schema = z.object({
  email: z.string(),
  phone: z.string(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  country: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export async function POST(request: NextApiRequest, response: NextApiResponse) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Account already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await argon.hash(body.password);

    await prisma.$transaction(async (trx) => {
      const user = await trx.user.create({
        data: {
          fullName: data.first_name + ' ' + data.last_name,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: Roles.User,
          location: data.country,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await trx.tokenBalance.create({
        data: {
          userId: user.id,
          currentBalance: 10,
          totalPurchased: 0,
          lastUpdated: new Date(),
        },
      });
    });

    await notificationService.sendEmail({
      to: data.email,
      subject: 'Welcome to B-Prepped AI',
      markdown: `
## Hi ${data.first_name},

Welcome to B-Prepped AI! 🎉

Your account is now active and ready to use. We also credited you with 10 tokens for your first analysis. Here's how to get started:

1. **Get your first 30 days free** → [Start your journey](https://b-prepped.ai/get-started)
2. **See what you can build** → [Explore features](https://b-prepped.ai/features)
3. **Need help?** → [Contact support](https://b-prepped.ai/support)

Your first step to smarter AI workflows is just one click away.

Best regards,  
The B-Prepped AI Team
      `,
    });

    return NextResponse.json(
      {
        message: 'success',
        email: data.email,
        password: data.password,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
