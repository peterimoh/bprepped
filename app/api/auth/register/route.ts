import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import * as argon from 'argon2';
import { Roles } from '@/lib/types';
import notificationService from '@/lib/notification';
import { formatRequestError } from '@/lib/backend/utils/request-error-handler';
import { ValidationError } from '@/lib/backend/utils/custom-error';

const schema = z.object({
  email: z.string().email('Please provide a valid email address').trim(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 digits')
    .regex(/^[+]?[\d\s()-]+$/, 'Please provide a valid phone number')
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character',
    })
    .trim(),
  country: z
    .string()
    .min(2, 'Country name must be at least 2 characters')
    .max(50, 'Country name must not exceed 50 characters')
    .trim(),
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .trim(),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .trim(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: data.email, mode: 'insensitive' } },
          { phone: data.phone },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email?.toLowerCase() === data.email.toLowerCase()) {
        throw new ValidationError('email already exists');
      }
      if (existingUser.phone === data.phone) {
        throw new ValidationError('phone number already exists');
      }
      throw new ValidationError('account already exists');
    }

    const hashedPassword = await argon.hash(data.password);

    const result = await prisma.$transaction(async (trx) => {
      const user = await trx.user.create({
        data: {
          fullName: `${data.first_name.trim()} ${data.last_name.trim()}`,
          email: data.email,
          phone: data.phone,
          password: hashedPassword,
          role: Roles.User,
          location: data.country,
        },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          createdAt: true,
        },
      });

      const tokenBalance = await trx.tokenBalance.create({
        data: {
          userId: user.id,
          currentBalance: 10,
          totalPurchased: 10,
        },
      });

      return { user, tokenBalance };
    });

    try {
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
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.fullName,
          role: result.user.role,
          createdAt: result.user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return formatRequestError(error);
  } finally {
    await prisma.$disconnect();
  }
}
