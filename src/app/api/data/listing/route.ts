import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/config/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    // Check if request body exists
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    // Parse request body
    let body
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.id) {
      return NextResponse.json(
        { error: 'id is required in request body' },
        { status: 400 }
      )
    }

    const db = await getDb()
    if (!db) {
      throw new Error('Database connection not available')
    }

    const collection = db.collection('listings')
    if (!collection) {
      throw new Error('Listing collection not found')
    }

    // Fetch IP assets with status 'registered', limit to 10
    const _asset = await collection.findOne({ associatedId: body.id })

    if (!_asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
    }

    return NextResponse.json({ asset: _asset }, { status: 200 })
  } catch (error) {
    console.error('Error fetching IP assets:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
