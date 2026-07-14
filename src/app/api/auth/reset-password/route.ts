import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { resetPasswordSchema } from '@/lib/validations';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid input',
        400,
        validation.error.errors
      );
    }

    const { token, newPassword } = validation.data;

    // Find token
    const resetToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new AppError(
        errorCodes.INVALID_TOKEN,
        'Invalid reset token',
        400
      );
    }

    if (new Date() > resetToken.expires) {
      throw new AppError(
        errorCodes.TOKEN_EXPIRED,
        'Reset token has expired',
        400
      );
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      throw new AppError(errorCodes.USER_NOT_FOUND, 'User not found', 404);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete token
    await db.verificationToken.delete({
      where: { id: resetToken.id },
    });

    return successResponse({ message: 'Password reset successful' });
  } catch (error) {
    return handleError(error);
  }
}
