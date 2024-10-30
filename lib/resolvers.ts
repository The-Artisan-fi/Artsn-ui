import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { hash, compare } from 'bcrypt';
import { Context } from '@/types/resolver-types';
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

    isUserRegistered: async (_parent: any, { publicKey }: { publicKey: string }, context: Context) => {
      try {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ publicKey });
        return !!user;
      } catch (error) {
        console.error('Error checking user registration:', error);
        return false;
      }
    },

    getListing: async (_parent: any, { associatedId }: { associatedId: string }, context: Context) => {
      const { db } = await connectToDatabase();
      const listing = await db.collection('listings').findOne({ associatedId });
      return listing;
    }
  },

  Mutation: {
    login: async (_: any, { publicKey, password }: { publicKey: string; password: string }) => {
      try {
        console.log('Login attempt with publicKey:', publicKey);
        
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        // Find user by public key
        const user = await usersCollection.findOne({ publicKey });
        console.log('Found user:', user ? 'yes' : 'no');

        if (!user) {
          console.error('User not found for publicKey:', publicKey);
          throw new Error('Invalid credentials');
        }

        // Since we're using publicKey as password in this case, we can either:
        // Option 1: Compare the raw values if that's your intended flow
        // if (password !== publicKey) {
        //   console.error('Password mismatch');
        //   throw new Error('Invalid credentials');
        // }

        // Option 2: Or if you want to use hashed password comparison
        const isValid = await compare(password, user.password);
        if (!isValid) {
          console.error('Password validation failed');
          throw new Error('Invalid credentials');
        }

        // Generate JWT token
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET not configured');
        }

        const token = jwt.sign(
          { 
            _id: user._id.toString(),
            publicKey: user.publicKey
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        console.log('Login successful, token generated');

        // Return the auth payload
        return {
          token,
          user: {
            ...user,
            _id: user._id.toString() // Convert ObjectId to string
          }
        };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    updateUser: async (_: any, { input }: { input: any }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        const { db } = await connectToDatabase();
        const collection = db.collection('users');
        
        const result = await collection.findOneAndUpdate(
          { _id: new ObjectId(context.user._id) },
          { $set: input },
          { returnDocument: 'after' }
        );

        if (!result) {
          throw new Error('User not found');
        }

        return result;
      } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
      }
    },
  },
};