import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { handleError, successResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const instructors = await db.instructor.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return successResponse({ instructors });
  } catch (error) {
    return handleError(error);
  }
}
