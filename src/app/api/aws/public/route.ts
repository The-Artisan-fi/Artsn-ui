import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.ARTISAN_AWS_REGION,
  credentials: {
    accessKeyId: process.env.ARTISAN_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ARTISAN_AWS_SECRET_ACCESS_KEY!,
  },
})

/**
 * Public Images Upload API Route Handler
 *
 * This route handles multiple public image uploads to AWS S3 for an existing asset,
 * maintains the same directory structure, and returns public URLs.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const userId = formData.get('userId') as string

    // Validate input
    if (!files.length || !userId) {
      return NextResponse.json(
        { success: false, message: 'Files, userId, and fileUuid are required' },
        { status: 400 }
      )
    }

    // Validate file types (ensure they're images)
    const validImageTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ]
    const invalidFiles = files.filter(
      (file) => !validImageTypes.includes(file.type)
    )
    if (invalidFiles.length > 0) {
      return NextResponse.json(
        { success: false, message: 'All files must be valid images' },
        { status: 400 }
      )
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file, index) => {
        // Prepare file for upload
        const fileBuffer = Buffer.from(await file.arrayBuffer())
        const key = `${userId}` // Simple numeric naming

        // Prepare S3 upload parameters
        const params = {
          Bucket: 'artisan-solana', // Use public bucket
          Key: key,
          Body: fileBuffer,
          ContentType: file.type,
        }

        // Upload file to S3
        const command = new PutObjectCommand(params)
        await s3Client.send(command)

        // Generate the public URL
        const publicUrl = `https://artisan-solana.s3.eu-central-1.amazonaws.com/${key}`

        return {
          url: publicUrl,
          key: key,
          contentType: file.type,
          size: file.size,
        }
      })
    )

    // Return success response with all file URLs and details
    return NextResponse.json(
      {
        success: true,
        message: 'Public images uploaded successfully',
        uploads: uploadedFiles,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading public images:', error)
    return NextResponse.json(
      { success: false, message: 'Error uploading public images' },
      { status: 500 }
    )
  }
}
