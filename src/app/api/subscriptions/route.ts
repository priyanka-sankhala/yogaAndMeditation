import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';
import { createSubscriptionSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const body = await request.json();

    // Validate input
    const validation = createSubscriptionSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid input',
        400,
        validation.error.errors
      );
    }

    const { planId, duration } = validation.data;

    // Check if plan exists
    const plan = await db.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new AppError(errorCodes.PLAN_NOT_FOUND, 'Plan not found', 404);
    }

    // Calculate price and end date
    let amount = 0;
    let durationInDays = 30;

    switch (duration) {
      case 'MONTHLY':
        amount = plan.monthlyPrice;
        durationInDays = 30;
        break;
      case 'HALF_YEARLY':
        amount = plan.halfYearlyPrice || plan.monthlyPrice * 6 * 0.9;
        durationInDays = 180;
        break;
      case 'YEARLY':
        amount = plan.yearlyPrice || plan.monthlyPrice * 12 * 0.85;
        durationInDays = 365;
        break;
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000);

    // Check for existing subscription
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId: auth.userId,
        planId: planId,
        status: 'ACTIVE',
      },
    });

    if (existingSubscription) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'You already have an active subscription for this plan',
        400
      );
    }

    // Create subscription
    const subscription = await db.subscription.create({
      data: {
        userId: auth.userId,
        planId: planId,
        planDuration: duration,
        startDate,
        endDate,
        status: 'PENDING',
        amount,
        currency: plan.currency,
        autoRenew: true,
      },
      include: {
        plan: true,
      },
    });

    return successResponse(
      {
        subscription,
        message: 'Subscription created. Proceed to payment.',
      },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId: auth.userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse({ subscriptions });
  } catch (error) {
    return handleError(error);
  }
}
