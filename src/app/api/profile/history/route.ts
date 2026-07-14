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

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'video' or 'audio'

    const where: any = { userId: auth.userId };

    if (type === 'video') {
      where.videoId = { not: null };
    } else if (type === 'audio') {
      where.audioId = { not: null };
    }

    const history = await db.viewHistory.findMany({
      where: type === 'video' ? where : undefined,
    });

    const playHistory = await db.playHistory.findMany({
      where: type === 'audio' ? where : undefined,
    });

    return successResponse({
      viewHistory: history,
      playHistory: playHistory,
    });
  } catch (error) {
    return handleError(error);
  }
}
