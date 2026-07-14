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

    const metrics = await db.referralMetric.findUnique({
      where: { userId: auth.userId },
    });

    if (!metrics) {
      return successResponse({
        metrics: {
          totalInvites: 0,
          registeredCount: 0,
          subscribedCount: 0,
          activeCount: 0,
          totalEarned: 0,
          availableBalance: 0,
        },
      });
    }

    return successResponse({ metrics });
  } catch (error) {
    return handleError(error);
  }
}
