import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await db.category.findUnique({
      where: { slug: params.slug },
    });

    if (!category) {
      throw new AppError(
        errorCodes.CATEGORY_NOT_FOUND,
        'Category not found',
        404
      );
    }

    // Get related content
    const videos = await db.video.findMany({
      where: {
        categoryId: category.id,
        isPublished: true,
      },
      include: {
        instructor: true,
        tags: true,
      },
      take: 10,
    });

    const audios = await db.audio.findMany({
      where: {
        categoryId: category.id,
        isPublished: true,
      },
      include: {
        instructor: true,
        tags: true,
      },
      take: 10,
    });

    return successResponse({
      category,
      videos,
      audios,
    });
  } catch (error) {
    return handleError(error);
  }
}
