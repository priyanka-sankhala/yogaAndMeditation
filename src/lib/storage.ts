import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const bucketName = process.env.AWS_S3_BUCKET || 'yoga-meditation';

export async function uploadFile(
  file: File,
  key: string
): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer as any,
      ContentType: file.type,
    });

    await s3Client.send(command);
    return key;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Get signed URL error:', error);
    throw error;
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    // Implement delete if needed
    console.log(`Deleting file: ${key}`);
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}
