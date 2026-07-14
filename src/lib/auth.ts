import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
);

export interface AuthContext {
  userId: string;
  email: string;
  role?: string;
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const verified = await jwtVerify(token, secret);
    
    return verified.payload as AuthContext;
  } catch (error) {
    return null;
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest) => {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return handler(request, auth);
  };
}

export function requireRole(role: string, handler: Function) {
  return async (request: NextRequest) => {
    const auth = await getAuthContext(request);
    if (!auth || auth.role !== role) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    return handler(request, auth);
  };
}
