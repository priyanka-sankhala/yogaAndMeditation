import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import { db } from './db';

export interface AuthContext {
  userId: string;
  email: string;
  role?: string;
}

export async function getAuthContext(
  request: NextRequest
): Promise<AuthContext | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token);

    // Verify session
    const session = await db.session.findFirst({
      where: {
        userId: payload.userId,
        sessionToken: token,
        expires: { gt: new Date() },
      },
    });

    if (!session) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
}
