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

    const favorites = await db.favorite.findMany({
      where: { userId: auth.userId },
      include: {
        video: {
          include: {
            category: true,
            instructor: true,
          },
        },
        audio: {
          include: {
            category: true,
            instructor: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse({ favorites });
  } catch (error) {
    return handleError(error);
  }
}
