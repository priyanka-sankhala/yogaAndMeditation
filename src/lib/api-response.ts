import { NextResponse } from 'next/server';
import { AppError, errorCodes } from './errors';

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function handleError(error: any) {
  console.error('[API Error]', error);

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Default error response
  return NextResponse.json(
    {
      success: false,
      error: {
        code: errorCodes.INTERNAL_SERVER_ERROR,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}
