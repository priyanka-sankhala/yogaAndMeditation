import { NextRequest, NextResponse } from 'next/server';
import { errorCodes, AppError } from './errors';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export function rateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 0, resetTime: now + WINDOW_MS };
  }

  const record = rateLimitStore[ip];

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + WINDOW_MS;
  }

  record.count++;

  if (record.count > MAX_REQUESTS) {
    throw new AppError(
      errorCodes.RATE_LIMITED,
      'Too many requests. Please try again later.',
      429
    );
  }
}

export function getCsrfToken(): string {
  // In production, this should be generated per session
  return Math.random().toString(36).substring(2);
}

export function validateCsrfToken(token: string, sessionToken: string): boolean {
  // In production, implement proper CSRF token validation
  return !!token && !!sessionToken;
}
