import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const token = request.searchParams.get('token');

    if (!token) {
      throw new AppError(
        errorCodes.INVALID_TOKEN,
        'Verification token is required',
        400
      );
    }

    // Find and verify token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      throw new AppError(
        errorCodes.INVALID_TOKEN,
        'Invalid verification token',
        400
      );
    }

    if (new Date() > verificationToken.expires) {
      throw new AppError(
        errorCodes.TOKEN_EXPIRED,
        'Verification token has expired',
        400
      );
    }

    // Mark email as verified
    await db.user.update({
      where: { id: verificationToken.userId || '' },
      data: { emailVerified: new Date() },
    });

    // Delete token
    await db.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return successResponse({ message: 'Email verified successfully' });
  } catch (error) {
    return handleError(error);
  }
}
