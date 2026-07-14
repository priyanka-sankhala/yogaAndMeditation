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

    const body = await request.json();
    const { score, review } = body;

    if (!score || score < 1 || score > 5) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Score must be between 1 and 5',
        400
      );
    }

    const audio = await db.audio.findUnique({
      where: { slug: params.slug },
    });

    if (!audio) {
      throw new AppError(errorCodes.CONTENT_NOT_FOUND, 'Audio not found', 404);
    }

    const rating = await db.rating.upsert({
      where: {
        userId_videoId_audioId: {
          userId: auth.userId,
          audioId: audio.id,
          videoId: null,
        },
      },
      create: {
        userId: auth.userId,
        audioId: audio.id,
        score,
        review: review || null,
      },
      update: {
        score,
        review: review || null,
      },
    });

    const ratings = await db.rating.findMany({
      where: { audioId: audio.id },
    });

    const avgRating =
      ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

    await db.audio.update({
      where: { id: audio.id },
      data: {
        rating: avgRating,
        ratingCount: ratings.length,
      },
    });

    return successResponse({ rating }, 201);
  } catch (error) {
    return handleError(error);
  }
}
