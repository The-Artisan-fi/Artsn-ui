import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from "mongodb";

const API_KEY = process.env.API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

export async function POST( _req: NextRequest ) {
    try {
        // TODO() - Fix this, some issue with the API key
        // Check API key
        // const apiKey = _req.headers.get('x-api-key');
        // if (apiKey !== API_KEY) {
        //     return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
        // }

        const { db } = await connectToDatabase();
        if (!db) {
            throw new Error('Database connection not available');
        }

        const collection = db.collection('listings');
        if (!collection) {
            throw new Error('IPAsset collection not found');
        }

        // Fetch IP assets with status 'registered', limit to 10
        const _asset = await collection.findOne({ associatedId: _.id });

        if(!_asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
        }
        console.log('asset', _asset);
        
        return NextResponse.json({ asset: _asset }, { status: 200 });
    } catch (error) {
        console.error('Error fetching IP assets:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}