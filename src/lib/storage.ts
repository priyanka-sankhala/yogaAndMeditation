import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'yoga-wellness-private';
const URL_EXPIRATION = parseInt(process.env.AWS_S3_SIGNED_URL_EXPIRATION || '3600');

export interface UploadOptions {
  key: string;
  contentType: string;
  metadata?: Record<string, string>;
}

/**
 * Generate a signed URL for downloading a file
 * URL expires after specified duration
 */
export async function getSignedDownloadUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: URL_EXPIRATION,
    });

    return url;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

/**
 * Generate a signed URL for uploading a file
 */
export async function getSignedUploadUrl(options: UploadOptions): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: options.key,
      ContentType: options.contentType,
      Metadata: options.metadata,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour for upload
    });

    return url;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw new Error('Failed to generate upload URL');
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Generate a key for storing content
 */
export function generateStorageKey(
  type: 'video' | 'audio' | 'image',
  userId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${type}/${userId}/${timestamp}-${random}-${filename}`;
}
