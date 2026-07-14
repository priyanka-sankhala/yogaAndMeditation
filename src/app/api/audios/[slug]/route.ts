import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';
import { getSignedDownloadUrl } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const audio = await db.audio.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        instructor: true,
        tags: true,
        ratings: {
          select: {
            score: true,
            review: true,
            user: { select: { name: true } },
          },
          take: 5,
        },
      },
    });

    if (!audio) {
      throw new AppError(errorCodes.CONTENT_NOT_FOUND, 'Audio not found', 404);
    }

    if (!audio.isPublished) {
      throw new AppError(
        errorCodes.CONTENT_NOT_FOUND,
        'Audio not published',
        404
      );
    }

    const auth = await getAuthContext(request);
    let signedUrl = null;

    if (auth && audio.requiresSubscription) {
      const subscription = await db.subscription.findFirst({
        where: {
          userId: auth.userId,
          status: 'ACTIVE',
          endDate: { gt: new Date() },
        },
      });

      if (subscription) {
        signedUrl = await getSignedDownloadUrl(audio.audioUrl);
      }
    } else if (!audio.requiresSubscription) {
      signedUrl = await getSignedDownloadUrl(audio.audioUrl);
    }

    // Increment play count
    await db.audio.update({
      where: { id: audio.id },
      data: { plays: { increment: 1 } },
    });

    if (auth) {
      await db.playHistory.upsert({
        where: {
          userId_audioId: {
            userId: auth.userId,
            audioId: audio.id,
          },
        },
        create: {
          userId: auth.userId,
          audioId: audio.id,
          playedDuration: 0,
        },
        update: { updatedAt: new Date() },
      });
    }

    return successResponse({
      audio: {
        ...audio,
        audioUrl: signedUrl,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
