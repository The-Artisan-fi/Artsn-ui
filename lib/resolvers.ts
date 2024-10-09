import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { hash, compare } from 'bcrypt';
import { IPAssetInput, IPAsset, Context } from '@/types/resolver-types';
import { IResolvers } from '@graphql-tools/utils';
import { v4 as uuidv4 } from 'uuid';

export const resolvers: IResolvers<any, Context> = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      try {
        const { db } = await connectToDatabase(); 
        const user = await db.collection('users').findOne({ _id: new ObjectId(context.user._id) });
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        console.error('Error in me query:', error);
        throw new Error('Failed to fetch user');
      }
    },
    isUserRegistered: async (_parent, { publicKey }, { db }): Promise<boolean> => {
      const user = await db.collection('users').findOne({ publicKey });
      return !!user;
    },
    getListing: async (_parent, { associatedId }, { db }) => {
      const listing = await db.collection('listings').findOne({ associatedId });
      console.log('listing ->', listing)
      return listing;
    }
  },
  Mutation: {
    createIPAsset: async (_parent: any, { input }: { input: IPAssetInput }, context: Context) => {
      if (!context.user) {
        console.log('context ->', context)
        throw new Error('Not authenticated');
      }
    
      try {
        console.log('Received input:', JSON.stringify(input, null, 2));
    
        // Validate input
        const requiredFields = ['name', 'description', 'fileLink', 'blockchainId', 'proofHash', 'status', 'type', 'subtype', 'rightsReserved', 'publicInformation', 'creativeProcess', 'contentDeclaration', 'aiReadiness'];
        for (const field of requiredFields) {
          if (!input[field as keyof IPAssetInput]) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
        const { db } = await connectToDatabase();
        const collection = db.collection('ipAssets');
    
        const newIPAsset: any = {
          ...input,
          // uuid: uuidv4(),
          // creatorId: context.user._id.toString(),
          // createdAt: new Date().toISOString(),
          // updatedAt: new Date().toISOString(),
          // collaborators: input.collaborators || [context.user._id.toString()],
          // tags: input.tags || [],
          // totalViews: 0,
          // totalLikes: 0,
          // totalShares: 0,
        };
    
        const result = await collection.insertOne(newIPAsset);
    
        // Update the user's ipAssets array
        await db.collection('users').updateOne(
          { _id: new ObjectId(context.user._id) },
          { $addToSet: { 'creatorInfo.ipAssets': result.insertedId } } as any
        );
        const _asset = {
          _id: result.insertedId,
          ...newIPAsset
        }
        return _asset;
      } catch (error) {
        console.error('Error creating IP Asset:', error);
        throw new Error('Failed to create IP Asset');
      }
    },
    updateUser: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      console.log('context ->', context)
      console.log('update input ->', input)
      const { db } = await connectToDatabase();
      const collection = db.collection('users');
      
      try {
        // Find the user and update in one operation
        const result = await collection.findOneAndUpdate(
          { _id: new ObjectId(context.user._id) },
          { $set: input },
          { returnDocument: 'after' }
        );
        if (!result!._id) {
          throw new Error('User not found');
        }

        const user: { _id: ObjectId; email: string; solanaTransactionId?: string } = { _id: new ObjectId(context.user._id), email: result!.email };
  
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        console.log('user + token ->', user, token)

        if (!result!._id) {
          throw new Error('User not found');
        }

        return result
      } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
      }
    },

    login: async (_: any, { publicKey, password }: {publicKey: string, password: string}) => {
      const { db } = await connectToDatabase();
      const usersCollection = db.collection('users');
  
      // Find user by publicKey
      const user = await usersCollection.findOne({ publicKey });
      console.log('found the user ->', user)
      if (!user) {
        throw new Error('Invalid credentials');
      }
  
      // Check password
      const isValid = await compare(password, user.password);
      console.log('is valid ->', isValid)
      if (!isValid) {
        throw new Error('Invalid credentials');
      }
      // Create token
      const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET! as string,
        { expiresIn: '1d' }
      );
      console.log('token ->', token)
      console.log('success ->',  user)
      return {
        token,
        user
      };
    },
    addCreatorProfile: async (_: any, { uuid, publicKey, creatorInfo }: any, context: Context) => {
      const { db } = await connectToDatabase();
      const collection = db.collection('users');
      
      try {
        // Find the user and update in one operation
        const result = await collection.findOneAndUpdate(
          { uuid: uuid },
          { 
            $set: { 
              creatorInfo: creatorInfo,
              publicKey: publicKey
            }
          },
          { 
            returnDocument: 'after',
            projection: {
              _id: 1,
              uuid: 1,
              email: 1,
              username: 1,
              creatorInfo: 1,
              publicKey: 1
            }
          }
        );

        if (!result!.value) {
          throw new Error('User not found');
        }

        return result!.value;
      } catch (error) {
        console.error('Error adding creator profile:', error);
        throw new Error('Failed to add creator profile');
      }
    },
  },
};