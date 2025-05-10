// app/api/kyc/webhook/route.ts
import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { headers } from 'next/headers'
import { getDb } from '@/config/mongodb'

interface OndatoWebhookPayload {
  id: string
  applicationId: string
  createdUtc: string
  payload: {
    id: string
    status: string
    statusReason: string
    completedUtc: string
    document?: {
      type: string
      files: Array<{
        fileId: string
        fileName: string
        fileType: string
        part: string
      }>
    }
  }
  type: string
}

interface KYCDocument {
  fileId: string
  fileName: string
  type: string
  part: string
}

// KYC Status mapping to match your schema
const KYC_STATUS_MAPPING = {
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
  Processing: 'PENDING',
  Failed: 'FAILED',
} as const

export async function POST(request: Request) {
  let client
  try {
    const webhookData: OndatoWebhookPayload = await request.json()
    console.log('Received webhook data:', JSON.stringify(webhookData, null, 2))

    if (webhookData.type !== 'KycIdentification.Updated') {
      return NextResponse.json({
        received: true,
        message: 'Webhook type not processed',
      })
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }

    const db = await getDb()
    const collection = db.collection('users')

    // Find user by KYC ID
    const user = await collection.findOne({
      'kycInfo.idvId': webhookData.payload.id,
    })

    if (!user) {
      console.log('User not found, trying to find by partial match...')
      const usersWithKyc = await collection
        .find({
          kycInfo: { $exists: true },
        })
        .toArray()

      return NextResponse.json(
        {
          error: 'User not found',
          debug: {
            searchedId: webhookData.payload.id,
            availableUsers: usersWithKyc.length,
          },
        },
        { status: 404 }
      )
    }

    // Process document files
    const kycDocuments =
      webhookData.payload.document?.files.map((file) => ({
        fileId: file.fileId,
        fileName: file.fileName,
        type: file.fileType,
        part: file.part,
      })) || []

    // Create the complete kycInfo object
    const kycInfo = {
      idvId: webhookData.payload.id,
      kycStatus:
        KYC_STATUS_MAPPING[
          webhookData.payload.status as keyof typeof KYC_STATUS_MAPPING
        ] || 'PENDING',
      kycCompletionDate: webhookData.payload.completedUtc,
      kycDocuments: kycDocuments,
    }

    // Update the entire kycInfo object at once
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { kycInfo } }
    )

    // Verify the update
    const updatedUser = await collection.findOne({
      _id: new ObjectId(user._id),
    })

    // Check if the update was successful (either modified or data was the same)
    const updateSuccessful =
      updateResult.matchedCount > 0 &&
      updatedUser?.kycInfo?.kycStatus === kycInfo.kycStatus

    if (!updateSuccessful) {
      return NextResponse.json(
        {
          error: 'Update verification failed',
          debug: {
            originalUser: user,
            attemptedUpdate: kycInfo,
            updateResult,
            finalState: updatedUser?.kycInfo,
          },
        },
        { status: 500 }
      )
    }

    // Log the successful update
    console.log('KYC update successful:', {
      userId: user._id,
      previousStatus: user.kycInfo?.kycStatus,
      newStatus: updatedUser.kycInfo?.kycStatus,
      updateStats: {
        matched: updateResult.matchedCount,
        modified: updateResult.modifiedCount,
      },
    })

    return NextResponse.json({
      received: true,
      status: 'success',
      userId: user._id,
      kycStatus: updatedUser.kycInfo.kycStatus,
      modified: updateResult.modifiedCount > 0,
      message:
        updateResult.modifiedCount === 0
          ? 'Webhook received, no changes needed (data already up to date)'
          : 'Webhook received, KYC information updated successfully',
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, x-ondato-signature',
      },
    }
  )
}

// EXAMPLE CURL REQUEST
// curl -X POST 'http://localhost:3000/api/kyc/webhook' \
// -H 'Content-Type: application/json' \
// -d '{
//   "id": "test-webhook-id",
//   "applicationId": "test-app-id",
//   "createdUtc": "2024-03-11T14:46:33.1467591Z",
//   "payload": {
//     "id": "4cc2296c-9401-45c5-bdfb-775b90d357dd",
//     "status": "Approved",
//     "statusReason": "Verified",
//     "completedUtc": "2024-03-11T14:46:33.1467591Z",
//     "document": {
//       "type": "DriverLicense",
//       "files": [
//         {
//           "fileId": "test-file-id-1",
//           "fileName": "front.jpg",
//           "fileType": "DocumentPhoto",
//           "part": "Front"
//         },
//         {
//           "fileId": "test-file-id-2",
//           "fileName": "back.jpg",
//           "fileType": "DocumentPhoto",
//           "part": "Back"
//         }
//       ]
//     }
//   },
//   "type": "KycIdentification.Updated"
// }'
