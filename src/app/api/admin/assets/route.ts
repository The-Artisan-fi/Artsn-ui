import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/config/mongodb'
import { verifyToken } from '@/lib/auth'
import { getSessionFromReq } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    // Get session with iron-session
    const res = new NextResponse()
    const session = await getSessionFromReq(req, res)
    
    if (!session.isLoggedIn) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const user = await verifyToken(session)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }
    
    // Parse request body
    const { asset } = await req.json()
    
    // Validate required fields
    const requiredFields = [
      'associatedId',
      'name',
      'uri',
      'reference',
      'attributes'
    ]
    
    for (const field of requiredFields) {
      if (!asset[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Set about field to description if not provided
    if (!asset.about && asset.description) {
      asset.about = asset.description
    }
    
    // Connect to database
    const db = await getDb()
    
    // Insert asset into database
    const result = await db.collection('listings').insertOne({
      ...asset,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user._id
    })
    
    const responseData = {
      message: 'Asset created successfully',
      assetId: result.insertedId
    }
    
    // Send the response with the updated cookies
    return new NextResponse(JSON.stringify(responseData), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json(
      { message: 'Failed to create asset', error: (error as Error).message },
      { status: 500 }
    )
  }
} 