import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';
import { updateProfileSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const profile = await db.userProfile.findUnique({
      where: { userId: auth.userId },
    });

    if (!profile) {
      throw new AppError(
        errorCodes.PROFILE_NOT_FOUND,
        'Profile not found',
        404
      );
    }

    return successResponse({ profile });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const body = await request.json();

    // Validate input
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid input',
        400,
        validation.error.errors
      );
    }

    const profile = await db.userProfile.update({
      where: { userId: auth.userId },
      data: validation.data,
    });

    return successResponse({
      profile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}
