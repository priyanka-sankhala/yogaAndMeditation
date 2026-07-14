import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';
import { getSignedDownloadUrl } from '@/lib/storage';

const ITEMS_PER_PAGE = 20;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const categoryId = searchParams.get('categoryId');
    const audioType = searchParams.get('type');
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');

    const skip = (page - 1) * ITEMS_PER_PAGE;

    const where: any = {
      isPublished: true,
      isActive: true,
    };

    if (categoryId) where.categoryId = categoryId;
    if (audioType) where.audioType = audioType;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await db.audio.count({ where });

    const audios = await db.audio.findMany({
      where,
      include: {
        category: true,
        instructor: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: ITEMS_PER_PAGE,
    });

    const sanitized = audios.map((a) => ({
      ...a,
      audioUrl: undefined,
    }));

    return successResponse({
      data: sanitized,
      pagination: {
        total,
        page,
        perPage: ITEMS_PER_PAGE,
        totalPages: Math.ceil(total / ITEMS_PER_PAGE),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
