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

    const body = await request.json();
    const { subscriptionId, amount, paymentMethod, transactionId } = body;

    // Validate subscription
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId },
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

    // Create payment record
    const payment = await db.payment.create({
      data: {
        subscriptionId,
        amount,
        currency: subscription.currency,
        paymentMethod,
        status: 'PROCESSING',
        transactionId,
      },
    });

    // TODO: Process payment with Stripe/Razorpay
    // For now, mark as success
    const updatedPayment = await db.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCESS' },
    });

    // Update subscription status
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'ACTIVE' },
    });

    // Create transaction record
    await db.transaction.create({
      data: {
        userId: auth.userId,
        type: 'SUBSCRIPTION_PURCHASE',
        amount,
        currency: subscription.currency,
        status: 'COMPLETED',
        paymentId: payment.id,
      },
    });

    return successResponse(
      {
        payment: updatedPayment,
        message: 'Payment processed successfully',
      },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}
