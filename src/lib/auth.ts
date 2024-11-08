import jwt from 'jsonwebtoken';
import { User } from '@/types/resolver-types';
import { connectToDatabase } from '@/config/mongodb';
import { ObjectId } from 'mongodb';

export async function verifyToken(token: string): Promise<User | null> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { _id: string; publicKey: string };
    
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded._id) });
    
    if (!user) {
      return null;
    }

    return {
      ...user,
      _id: user._id.toString(),
    } as User;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function generateToken(user: User): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(
    { 
      _id: user!._id!.toString(),
      publicKey: user.publicKey
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}