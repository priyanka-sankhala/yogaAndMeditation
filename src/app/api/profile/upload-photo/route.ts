import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getAuthContext } from '@/lib/auth';
import { handleError, successResponse } from '@/lib/api-response';
import { AppError, errorCodes } from '@/lib/errors';
import { uploadProfilePhotoSchema } from '@/lib/validations';
import { uploadFile } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      throw new AppError(errorCodes.UNAUTHORIZED, 'Unauthorized', 401);
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'File is required',
        400
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'Only image files are allowed',
        400
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new AppError(
        errorCodes.VALIDATION_ERROR,
        'File size must be less than 5MB',
        400
      );
    }

    // Upload file
    const fileName = `profile-${auth.userId}-${Date.now()}`;
    const fileUrl = await uploadFile(file, `profile-photos/${fileName}`);

    // Update profile
    const profile = await db.userProfile.update({
      where: { userId: auth.userId },
      data: { profilePhoto: fileUrl },
    });

    return successResponse({ profile }, 201);
  } catch (error) {
    return handleError(error);
  }
}
