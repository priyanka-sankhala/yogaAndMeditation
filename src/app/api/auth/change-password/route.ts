import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/password';
import { changePasswordSchema } from '@/lib/validations';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const body = await request.json();

    // Validate input
    const validation = changePasswordSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid input',
        400,
        validation.error.errors
      );
    }

    const { currentPassword, newPassword } = validation.data;

    // Get user
    const user = await db.user.findUnique({
      where: { id: auth.userId },
    });

    if (!user || !user.password) {
      throw new AppError(errorCodes.USER_NOT_FOUND, 'User not found', 404);
    }

    // Verify current password
    const passwordMatch = await verifyPassword(currentPassword, user.password);
    if (!passwordMatch) {
      throw new AppError(
        errorCodes.INVALID_CREDENTIALS,
        'Current password is incorrect',
        401
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return successResponse({ message: 'Password changed successfully' });
  } catch (error) {
    return handleError(error);
  }
}
