import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
/**
 * Register API Route Handler
 * 
 * This route handles user registration by creating a new user account
 * with a hashed password and unique UUID.
 */
export async function POST(_req: Request) {
  try {
    // Parse the request body
    const req = await _req.json();
    
    console.log('incoming req ->', req)
    const { email, password, publicKey, firstName, lastName, country, profilePictureUrl } = req;

    // Check if email and password are provided
    if (!publicKey) {
      return new Response(JSON.stringify({ error: 'Missing publicKey' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Connect to the database
      const { db } = await connectToDatabase();
      const collection = db.collection('users');

      // Check if user already exists
      const existingUser = await collection.findOne({ publicKey });
      console.log('existing user ->', existingUser)
      if (existingUser) {
        return new Response(JSON.stringify({ error: 'User already exists.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Hash the password
      const hashedPassword = await hash(password, 10);
      console.log('hashed password ->', hashedPassword)
      console.log('inserting user ->', email, hashedPassword, uuidv4(), publicKey)
      const _user = await collection.insertOne({ 
        email, 
        password: hashedPassword, 
        uuid: uuidv4(),
        username: email,
        firstName: firstName,
        lastName: lastName,
        country: country,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: '',
        isActive: true,
        role: 'Pending',
        verificationToken: '',
        isVerified: false,
        coverImageUrl: '',
        profilePictureUrl: profilePictureUrl,
        publicKey,
        solanaTransactionId: '',
        phoneNumber: '',
        baseProfile: {
          id: uuidv4(),
          displayName: '',
          displayRole: '',
          photoUrl: '',
          bio: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        creatorInfo: {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          detailedBio: {
            profession: '',
            education: {
              schools: [],
              relevantCourses: [],
              specializedTraining: [],
            },
            professionalAchievements: {
              awards: [],
              exhibitions: [],
              portfolioLinks: [],
            },
            collaborators: [],
            employmentContracts: [],
          },
          ipAssets: [],
        },
        investorInfo: {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          investmentPreferences: [],
          investmentHistory: [],
          portfolioSize: 0,
          riskTolerance: '',
          preferredInvestmentDuration: '',
        },
        kycInfo: {
          kycStatus: '',
          kycCompletionDate: '',
          kycDocuments: [],
        },
      });
      console.log('_user', _user)
      if(!_user) {
        return new Response(JSON.stringify({ error: 'Error registering user.' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const insertedId = _user.insertedId;

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/protocol/create/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: publicKey,
          username: insertedId,
          profileType: 'Investor',
          isPublic: true
        }),
      });
      const data = await res.json();
      let signature = data.signature ? data.signature : 'error';
      console.log('create profile signature ->', signature)
      if (!signature) {
        // throw new Error('Failed to create profile on chain');
        console.log('Failed to create profile on chain');
        signature = 'error';
      }
      // Update the user with the Solana transaction ID
      await db.collection('users').updateOne(
        { _id: insertedId },
        { 
          $set: { 
            username: insertedId.toString(),
            solanaTransactionId: signature,
            role: "Investor"
          }
        }
      );
      // Return successful response
      return new Response(JSON.stringify({
        message: 'User registered successfully.',
        userId: insertedId,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.log('Error registering user:', error);
      // Handle database or other errors
      return new Response(JSON.stringify({
        error: 'Error registering user.',
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    // Handle JSON parsing errors
    return new Response(JSON.stringify({
      error: 'Error registering user.',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}