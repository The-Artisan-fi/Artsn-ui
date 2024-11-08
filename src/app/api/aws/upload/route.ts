import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * AWS Upload API Route Handler
 * 
 * This route handles file uploads to AWS S3, generates a proof of upload,
 * and returns the S3 key for accessing the uploaded file.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    // Validate input
    if (!file || !userId) {
      return NextResponse.json({ success: false, message: 'File and userId are required' }, { status: 400 });
    }

    // Prepare file for upload
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileUuid = uuidv4();
    const key = `${userId}/${fileUuid}/${file.name}`;

    // Generate file hash
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Prepare S3 upload parameters
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: file.type,
      Metadata: {
        userId: userId,
        fileHash: fileHash,
      }
    };

    // Upload file to S3
    const command = new PutObjectCommand(params);
    const uploadResult = await s3Client.send(command);

    // Create proof of upload
    const proofOfUpload = {
      fileHash: fileHash,
      s3ETag: uploadResult.ETag?.replace(/"/g, ''), // Remove quotes from ETag
      uploadTimestamp: new Date().toISOString(),
      fileUuid: fileUuid,
      fileName: file.name,
      fileSize: file.size,
    };

    // Generate proof hash
    const proofHash = crypto.createHash('sha256').update(JSON.stringify(proofOfUpload)).digest('hex');

    // Return success response with S3 key instead of signed URL
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      key: key,
      uuid: fileUuid,
      proofOfUpload: proofOfUpload,
      proofHash: proofHash
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, message: 'Error uploading file' }, { status: 500 });
  }
}