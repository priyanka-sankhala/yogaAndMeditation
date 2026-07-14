import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const video = await db.video.findUnique({
      where: { slug: params.slug },
    });

    if (!video) {
      throw new AppError(errorCodes.CONTENT_NOT_FOUND, 'Video not found', 404);
    }

    // Toggle favorite
    const existing = await db.favorite.findUnique({
      where: {
        userId_videoId_audioId: {
          userId: auth.userId,
          videoId: video.id,
          audioId: null,
        },
      },
    });

    if (existing) {
      await db.favorite.delete({ where: { id: existing.id } });
      return successResponse({ favorited: false });
    } else {
      await db.favorite.create({
        data: {
          userId: auth.userId,
          videoId: video.id,
          type: 'VIDEO',
        },
      });
      return successResponse({ favorited: true }, 201);
    }
  } catch (error) {
    return handleError(error);
  }
}
