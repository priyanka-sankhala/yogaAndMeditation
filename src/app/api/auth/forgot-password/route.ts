import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { forgotPasswordSchema } from '@/lib/validations';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid email',
        400
      );
    }

    const { email } = validation.data;

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      return successResponse({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }

    // Create reset token
    const resetToken = await db.verificationToken.create({
      data: {
        email,
        token: Math.random().toString(36).substring(2),
        type: 'PASSWORD_RESET',
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        userId: user.id,
      },
    });

    // Send reset email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await sendPasswordResetEmail(email, resetToken.token, appUrl);

    return successResponse({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    return handleError(error);
  }
}
