import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { createToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validations';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid email or password',
        400
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await db.user.findUnique({
      where: { email },
      include: { roles: true, profile: true },
    });

    if (!user || !user.password) {
      throw new AppError(
        errorCodes.INVALID_CREDENTIALS,
        'Invalid email or password',
        401
      );
    }

    // Check if user is active
    if (!user.isActive || user.isSuspended) {
      throw new AppError(
        errorCodes.UNAUTHORIZED,
        'Your account is inactive or suspended',
        403
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new AppError(
        errorCodes.EMAIL_NOT_VERIFIED,
        'Please verify your email first',
        403
      );
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      throw new AppError(
        errorCodes.INVALID_CREDENTIALS,
        'Invalid email or password',
        401
      );
    }

    // Create tokens
    const token = await createToken(
      {
        userId: user.id,
        email: user.email,
        role: user.roles[0]?.name,
      },
      '24h'
    );

    const refreshToken = await createToken(
      { userId: user.id, email: user.email },
      '7d'
    );

    // Create session
    const session = await db.session.create({
      data: {
        userId: user.id,
        sessionToken: token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        ipAddress: request.headers.get('x-forwarded-for') || '',
        userAgent: request.headers.get('user-agent') || '',
      },
    });

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.roles[0]?.name,
      },
      token,
      refreshToken,
      expiresIn: '24h',
    });
  } catch (error) {
    return handleError(error);
  }
}
