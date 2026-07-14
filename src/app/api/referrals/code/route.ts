import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';
import { generateUniqueCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    // Check if user already has a referral code
    const user = await db.user.findUnique({
      where: { id: auth.userId },
    });

    if (user?.referralCode) {
      return successResponse({
        referralCode: user.referralCode,
        message: 'Referral code already generated',
      });
    }

    // Generate unique code
    let code = generateUniqueCode('YM', 6);
    let exists = await db.user.findUnique({
      where: { referralCode: code },
    });

    while (exists) {
      code = generateUniqueCode('YM', 6);
      exists = await db.user.findUnique({
        where: { referralCode: code },
      });
    }

    // Update user with referral code
    const updated = await db.user.update({
      where: { id: auth.userId },
      data: { referralCode: code },
    });

    return successResponse(
      {
        referralCode: code,
        referralLink: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${code}`,
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

    const user = await db.user.findUnique({
      where: { id: auth.userId },
    });

    if (!user?.referralCode) {
      return successResponse({ referralCode: null });
    }

    const metrics = await db.referralMetric.findUnique({
      where: { userId: auth.userId },
    });

    return successResponse({
      referralCode: user.referralCode,
      referralLink: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${user.referralCode}`,
      metrics,
    });
  } catch (error) {
    return handleError(error);
  }
}
