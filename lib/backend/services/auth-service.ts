import * as argon from 'argon2';
import { prisma } from '@/lib/prisma';
import { Roles } from '@/lib/types';
import notificationService from '@/lib/notification';
import { ValidationError, InternalServerError, ConflictError } from '@/lib/backend/utils/custom-error';
import { generateResetToken } from '@/lib/backend/utils/password-token';
import { z } from 'zod';

export const RegistrationSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
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

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim().toLowerCase(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().uuid('Invalid reset token'),
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

export const VerifyTokenSchema = z.object({
  token: z.string().uuid('Invalid reset token'),
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;
export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
export type VerifyTokenData = z.infer<typeof VerifyTokenSchema>;

const INITIAL_TOKEN_BALANCE = 10;

export class AuthService {
  async register(data: RegistrationData) {
    // 1. Check for existing user
    await this.validateUniqueUser(data.email, data.phone);

    // 2. Hash password
    const hashedPassword = await argon.hash(data.password);

    // 3. Create user and initial balance in transaction
    const result = await prisma.$transaction(async (trx) => {
      const user = await trx.user.create({
        data: {
          fullName: `${data.first_name} ${data.last_name}`,
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

      await trx.tokenBalance.create({
        data: {
          userId: user.id,
          currentBalance: INITIAL_TOKEN_BALANCE,
          totalPurchased: INITIAL_TOKEN_BALANCE,
        },
      });

      return user;
    });

    // 4. Send welcome email (asynchronous via queue)
    this.enqueueWelcomeEmail(data.email, data.first_name);

    return result;
  }

  async requestPasswordReset(data: ForgotPasswordData) {
    const user = await prisma.user.findFirst({
      where: { email: { equals: data.email, mode: 'insensitive' } },
    });

    if (user && user.email) {
      const { token } = await generateResetToken(user.email);
      if (!token) throw new InternalServerError('Request Failed');

      this.enqueuePasswordResetEmail(user.email, user.fullName || '', token);
    }

    // Always return success to avoid email enumeration
    return { message: 'success' };
  }

  async verifyResetToken(data: VerifyTokenData) {
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token: data.token },
    });

    if (!resetToken) {
      throw new ValidationError('Invalid or expired reset token');
    }

    if (resetToken.expires < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken
        .delete({ where: { id: resetToken.id } })
        .catch(() => {});
      throw new ValidationError('Reset token has expired');
    }

    return { message: 'success' };
  }

  async resetPassword(data: ResetPasswordData) {
    // 1. Find and validate the token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: { token: data.token },
    });

    if (!resetToken) {
      throw new ValidationError('Invalid or expired reset token');
    }

    if (resetToken.expires < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken
        .delete({ where: { id: resetToken.id } })
        .catch(() => {});
      throw new ValidationError('Reset token has expired');
    }

    // 2. Find the user by email from the token
    const user = await prisma.user.findFirst({
      where: { email: resetToken.email },
    });

    if (!user) {
      throw new ValidationError('User associated with this token no longer exists');
    }

    // 3. Hash the new password
    const hashedPassword = await argon.hash(data.password);

    // 4. Update the user password and delete the used token in a transaction
    await prisma.$transaction(async (trx) => {
      await trx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await trx.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
    });

    return { message: 'Password reset successful' };
  }

  private async validateUniqueUser(email: string, phone: string) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: 'insensitive' } },
          { phone: phone },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email?.toLowerCase() === email.toLowerCase()) {
        throw new ConflictError('Email already exists');
      }
      if (existingUser.phone === phone) {
        throw new ConflictError('Phone number already exists');
      }
      throw new ConflictError('Account already exists');
    }
  }

  private enqueueWelcomeEmail(email: string, firstName: string) {
    notificationService.enqueueEmail({
      to: email,
      subject: 'Welcome to B-Prepped AI',
      markdown: `
## Hi ${firstName},

Welcome to B-Prepped AI! 🎉

Your account is now active and ready to use. We also credited you with ${INITIAL_TOKEN_BALANCE} tokens for your first analysis. Here's how to get started:

1. **Get your first 30 days free** → [Start your journey](https://b-prepped.ai/get-started)
2. **See what you can build** → [Explore features](https://b-prepped.ai/features)
3. **Need help?** → [Contact support](https://b-prepped.ai/support)

Your first step to smarter AI workflows is just one click away.

Best regards,
The B-Prepped AI Team
      `,
    }).catch((error) => {
      console.error('Failed to enqueue welcome email:', error);
    });
  }

  private enqueuePasswordResetEmail(
    email: string,
    fullName: string,
    token: string
  ) {
    const firstName = fullName.split(' ')[0] || 'there';
    const resetUrl = `${process.env.APP_URL}/password-reset?token=${token}`;

    notificationService.enqueueEmail({
      to: email,
      subject: 'Password Reset',
      markdown: `
Hello **${firstName}**,

You recently requested to reset your password for your account. Click the link below to reset your password:

[Reset Your Password](${resetUrl})

This link will expire in **5 minutes** for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

If you're concerned about the security of your account, we recommend:
- Logging into your account directly
- Updating your password immediately

Thank you for using our service!

Best regards.
      `,
    }).catch((error) => {
      console.error('Failed to enqueue password reset email:', error);
    });
  }
}

export const authService = new AuthService();
