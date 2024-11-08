import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { key, userId } = await request.json();

    // Validate the request
    if (!key || !userId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Security check: Ensure the userId in the key matches the requesting userId
    const keyUserId = key.split('/')[0];
    if (keyUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 });
    }

    // Generate signed URL with longer expiration
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 12 * 60 * 60, // 12 hours
    });

    return NextResponse.json({ url: signedUrl });

  } catch (error) {
    console.error('Error generating file URL:', error);
    return NextResponse.json({ error: 'Failed to generate file URL' }, { status: 500 });
  }
}