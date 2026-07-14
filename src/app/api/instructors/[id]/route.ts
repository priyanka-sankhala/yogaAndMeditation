import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructor = await db.instructor.findUnique({
      where: { id: params.id },
    });

    if (!instructor) {
      throw new AppError(
        errorCodes.INSTRUCTOR_NOT_FOUND,
        'Instructor not found',
        404
      );
    }

    // Get instructor's videos and audios
    const videos = await db.video.findMany({
      where: {
        instructorId: instructor.id,
        isPublished: true,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    const audios = await db.audio.findMany({
      where: {
        instructorId: instructor.id,
        isPublished: true,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    return successResponse({
      instructor,
      videos,
      audios,
    });
  } catch (error) {
    return handleError(error);
  }
}
