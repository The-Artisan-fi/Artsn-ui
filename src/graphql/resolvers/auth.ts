import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/config/mongodb';
import { compare } from 'bcrypt';
import { Context } from '@/types/resolver-types';
import { IResolvers } from '@graphql-tools/utils';

export const authResolvers: IResolvers<any, Context> = {
  Mutation: {
    login: async (_: any, { publicKey, password }: { publicKey: string; password: string }) => {
      try {
        console.log('Login attempt with publicKey:', publicKey);
        
        const { db } = await connectToDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ publicKey });
        console.log('Found user:', user ? 'yes' : 'no');

        if (!user) {
          console.error('User not found for publicKey:', publicKey);
          throw new Error('Invalid credentials');
        }

        // const isValid = await compare(password, user.password);
        const isValid = password === user.publicKey;
        if (!isValid) {
          console.error('Password validation failed');
          throw new Error('Invalid credentials');
        }

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

        return {
          token,
          user: {
            ...user,
            _id: user._id.toString()
          }
        };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
  },
};