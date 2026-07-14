import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const plans = await db.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return successResponse({ plans });
  } catch (error) {
    return handleError(error);
  }
}
