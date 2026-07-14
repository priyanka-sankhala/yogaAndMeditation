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
    const video = await db.video.findUnique({
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

    if (!video) {
      throw new AppError(errorCodes.CONTENT_NOT_FOUND, 'Video not found', 404);
    }

    if (!video.isPublished) {
      throw new AppError(
        errorCodes.CONTENT_NOT_FOUND,
        'Video not published',
        404
      );
    }

    // Check subscription access
    const auth = await getAuthContext(request);
    let signedUrl = null;

    if (auth && video.requiresSubscription) {
      // Check if user has active subscription
      const subscription = await db.subscription.findFirst({
        where: {
          userId: auth.userId,
          status: 'ACTIVE',
          endDate: { gt: new Date() },
        },
      });

      if (subscription) {
        signedUrl = await getSignedDownloadUrl(video.videoUrl);
      }
    } else if (!video.requiresSubscription) {
      signedUrl = await getSignedDownloadUrl(video.videoUrl);
    }

    // Increment view count
    await db.video.update({
      where: { id: video.id },
      data: { views: { increment: 1 } },
    });

    // Record view history if authenticated
    if (auth) {
      await db.viewHistory.upsert({
        where: {
          userId_videoId: {
            userId: auth.userId,
            videoId: video.id,
          },
        },
        create: {
          userId: auth.userId,
          videoId: video.id,
          watchedDuration: 0,
        },
        update: { updatedAt: new Date() },
      });
    }

    return successResponse({
      video: {
        ...video,
        videoUrl: signedUrl, // Return signed URL instead of key
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
