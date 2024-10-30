import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId, Double, MongoServerError } from 'mongodb';

interface RegistrationRequest {
  email?: string;
  password: string;
  publicKey: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  profilePictureUrl?: string;
}

export async function POST(_req: Request) {
  try {
    const req = await _req.json() as RegistrationRequest;
    
    if (!req.publicKey) {
      return new Response(
        JSON.stringify({ error: 'Public key is required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' }}
      );
    }

    const { db } = await connectToDatabase();
    const collection = db.collection('users');
    
    // Ensure index exists (will not recreate if it already exists)
    await collection.createIndex({ "publicKey": 1 }, { unique: true });
    
    const now = new Date().toISOString();
    const hashedPassword = await hash(req.password, 10);
    const userId = uuidv4();

    const completeUser = {
      uuid: userId,
      email: req.email || `${userId}@placeholder.com`,
      password: hashedPassword,
      username: req.email || userId,
      firstName: req.firstName || 'Unnamed',
      lastName: req.lastName || 'User',
      country: req.country || 'Not Specified',
      publicKey: req.publicKey,
      role: 'Investor',
      createdAt: now,
      updatedAt: now,
      isActive: true,
      isVerified: false,
      phoneNumber: '',
      solanaTransactionId: '',  // Initialize empty
      
      baseProfile: {
        id: uuidv4(),
        displayName: `${req.firstName || 'Unnamed'} ${req.lastName || 'User'}`,
        displayRole: 'Investor',
        photoUrl: req.profilePictureUrl || '',
        bio: '',
        createdAt: now,
        updatedAt: now,
        totalSpend: new Double(0)
      },
      
      investorInfo: {
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        investmentPreferences: [],
        investmentHistory: [],
        portfolioSize: new Double(0),
        riskTolerance: 'Not Specified',
        preferredInvestmentDuration: 'Not Specified'
      },
      
      kycInfo: {
        kycStatus: 'Not Started',
        kycCompletionDate: '',
        kycDocuments: []
      }
    };

    let insertedId: ObjectId;
    
    try {
      // Try to insert the user
      const result = await collection.insertOne(completeUser);
      insertedId = result.insertedId;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        // Duplicate key error (publicKey already exists)
        return new Response(
          JSON.stringify({ error: 'User with this public key already exists' }), 
          { status: 409, headers: { 'Content-Type': 'application/json' }}
        );
      }
      throw error; // Re-throw other errors
    }

    // Create on-chain profile - wrap in try/catch but don't fail if it errors
    let solanaSignature = '';
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const profileResponse = await fetch(`${baseUrl}/api/protocol/create/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: req.publicKey,
          username: insertedId.toString(),
          profileType: 'Investor',
          isPublic: true
        })
      });

      if (!profileResponse.ok) {
        throw new Error(`Profile creation failed: ${profileResponse.statusText}`);
      }

      const profileData = await profileResponse.json();
      solanaSignature = profileData.signature || 'error';

      // Update transaction ID if we got one
      if (solanaSignature && solanaSignature !== 'error') {
        await collection.updateOne(
          { _id: insertedId },
          { $set: { solanaTransactionId: solanaSignature }}
        );
      }
    } catch (error) {
      console.error('Failed to create on-chain profile:', error);
      // Don't throw error, just continue with registration
      solanaSignature = 'failed';
    }

    return new Response(
      JSON.stringify({
        message: 'User registered successfully',
        userId: insertedId,
        solanaStatus: solanaSignature ? 'success' : 'failed'
      }),
      { headers: { 'Content-Type': 'application/json' }}
    );

  } catch (error: any) {
    console.error('Registration error details:', {
      message: error.message,
      code: error.code,
      errInfo: error.errInfo,
      stack: error.stack
    });

    // Handle validation errors
    if (error.code === 121) {
      const validationErrors = error.errInfo?.details?.schemaRulesNotSatisfied || [];
      return new Response(
        JSON.stringify({ 
          error: 'Registration failed - validation error',
          details: validationErrors 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' }}
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Registration failed',
        details: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' }}
    );
  }
}