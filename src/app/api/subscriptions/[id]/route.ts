import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';
import { cancelSubscriptionSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const subscription = await db.subscription.findUnique({
      where: { id: params.id },
      include: { plan: true },
    });

    if (!subscription) {
      throw new AppError(
        errorCodes.SUBSCRIPTION_NOT_FOUND,
        'Subscription not found',
        404
      );
    }

    if (subscription.userId !== auth.userId) {
      throw new AppError(errorCodes.FORBIDDEN, 'Forbidden', 403);
    }

    return successResponse({ subscription });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const body = await request.json();

    // Validate input
    const validation = cancelSubscriptionSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid input',
        400
      );
    }

    const subscription = await db.subscription.findUnique({
      where: { id: params.id },
    });

    if (!subscription) {
      throw new AppError(
        errorCodes.SUBSCRIPTION_NOT_FOUND,
        'Subscription not found',
        404
      );
    }

    if (subscription.userId !== auth.userId) {
      throw new AppError(errorCodes.FORBIDDEN, 'Forbidden', 403);
    }

    // Cancel subscription
    const updated = await db.subscription.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        autoRenew: false,
        cancelledAt: new Date(),
      },
      include: { plan: true },
    });

    return successResponse({
      subscription: updated,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}
