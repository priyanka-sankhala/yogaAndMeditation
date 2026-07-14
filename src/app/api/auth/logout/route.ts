import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    // Delete session
    await db.session.deleteMany({
      where: { userId: auth.userId },
    });

    return successResponse({ message: 'Logged out successfully' });
  } catch (error) {
    return handleError(error);
  }
}
