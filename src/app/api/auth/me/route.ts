import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const user = await db.user.findUnique({
      where: { id: auth.userId },
      include: {
        roles: true,
        profile: true,
      },
    });

    if (!user) {
      throw new AppError(errorCodes.USER_NOT_FOUND, 'User not found', 404);
    }

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        roles: user.roles,
        profile: user.profile,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
