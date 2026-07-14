import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { createToken } from '@/lib/jwt';
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email';
import { registerSchema } from '@/lib/validations';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Invalid input',
        400,
        validation.error.errors
      );
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(
        errorCodes.EMAIL_ALREADY_EXISTS,
        'Email already registered',
        400
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roles: {
          connect: {
            name: 'USER',
          },
        },
      },
      include: {
        roles: true,
      },
    });

    // Create user profile
    await db.userProfile.create({
      data: {
        userId: user.id,
        firstName: name?.split(' ')[0],
        lastName: name?.split(' ').slice(1).join(' '),
      },
    });

    // Generate verification token
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        token: Math.random().toString(36).substring(2),
        type: 'EMAIL_VERIFICATION',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        userId: user.id,
      },
    });

    // Send verification email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await sendVerificationEmail(
      email,
      verificationToken.token,
      appUrl
    );

    // Send welcome email
    await sendWelcomeEmail(name || 'User', email);

    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: 'Registration successful. Please check your email to verify your account.',
      },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}
