import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/config/mongodb';
import { Context } from '@/types/resolver-types';
import { IResolvers } from '@graphql-tools/utils';
import { UserModel } from '../models/User';
import { CreateUserInput } from '@/types/resolver-types';
import { ApolloError } from 'apollo-server-micro';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '@/lib/db/utils';
import { Double } from 'mongodb';
import { GraphQLError } from 'graphql';

export const userResolvers: IResolvers<any, Context> = {
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

    isUserRegistered: async (_parent: any, { publicKey }: { publicKey: string }) => {
      try {
        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ publicKey });
        return !!user;
      } catch (error) {
        console.error('Error checking user registration:', error);
        return false;
      }
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: { input: any }, { db }: Context) => {
      try {
        const users = db.collection('users');

        // Log the validation schema to debug
        const collections = await db.listCollections({ name: 'users' }).toArray();
        console.log('Schema validation:', JSON.stringify((collections[0] as any).options?.validator, null, 2));

        // Check if user exists
        const existingUser = await users.findOne({ publicKey: input.publicKey });
        if (existingUser) {
          throw new Error('User with this public key already exists');
        }

        // Generate IDs for required nested objects
        const baseProfileId = uuidv4();
        const investorInfoId = uuidv4();
        const now = new Date().toISOString();

        const newUser = {
          // Required top-level fields
          email: input.email || 'unknown',
          password: input.password,
          uuid: uuidv4(),
          username: input.username || `user_${input.publicKey.slice(0, 6)}`,
          firstName: input.firstName || 'Unknown',
          lastName: input.lastName || 'Unknown',
          country: input.country || 'Unknown',

          // Optional top-level fields with defaults
          publicKey: input.publicKey,
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
          isActive: input.isActive ?? true,
          role: input.role || 'USER',
          verificationToken: '', // Required by schema
          isVerified: input.isVerified ?? false,
          solanaTransactionId: '',
          phoneNumber: '',

          // Required nested objects
          socialLinks: {
            twitter: '',
            instagram: '',
            website: ''
          },

          baseProfile: {
            id: baseProfileId, // Required by schema
            displayName: input.username || `user_${input.publicKey.slice(-4)}`,
            displayRole: input.role || 'USER',
            photoUrl: 'https://monaco-public.s3.eu-central-1.amazonaws.com/671a01ed57cfa29934ac5606/b824143e-f6c4-4b29-87f7-42519fd6556e/0',
            bio: '',
            createdAt: now,
            updatedAt: now
          },

          investorInfo: {
            id: investorInfoId, // Required by schema
            createdAt: now,
            updatedAt: now,
            investmentPreferences: [],
            investmentHistory: [],
            portfolioSize: new Double(0.0),
            riskTolerance: 'MODERATE',
            preferredInvestmentDuration: 'MEDIUM',
            totalSpend: new Double(0.0)
          },

          kycInfo: {
            kycStatus: 'PENDING',
            kycCompletionDate: now,
            kycDocuments: []
          }
        };

        // Log the document we're trying to insert
        console.log('Attempting to insert document:', JSON.stringify(newUser, null, 2));

        const result = await users.insertOne(newUser);
        
        if (!result.acknowledged) {
          throw new Error('Failed to create user');
        }

        const savedUser = await users.findOne({ _id: result.insertedId });
        if (!savedUser) {
          throw new Error('Failed to retrieve created user');
        }

        // Remove sensitive data before returning
        const { password: _, ...userWithoutPassword } = savedUser;
        return userWithoutPassword;

      } catch (error: any) {
        console.error('Error creating user:', {
          message: error.message,
          code: error.code,
          errInfo: error.errInfo
        });

        // If it's a validation error, log more details
        if (error.code === 121) {
          console.error('Validation failure details:', 
            JSON.stringify(error.errInfo?.details?.schemaRulesNotSatisfied, null, 2)
          );
        }

        throw error;
      }
    },
    updateUser: async (_: any, { input }: { input: any }, { db, user }: Context) => {
      if (!user) {
        throw new GraphQLError('Not authenticated');
      }

      try {
        const collection = db.collection('users');
        
        // Get current user data
        const currentUser = await collection.findOne({ 
          _id: new ObjectId(user._id) 
        });

        if (!currentUser) {
          throw new GraphQLError('User not found');
        }

        // Process investorInfo with proper Double conversion
        let processedInvestorInfo = null;
        if (input.investorInfo || currentUser.investorInfo) {
          const inputInfo = input.investorInfo || {};
          processedInvestorInfo = {
            ...currentUser.investorInfo,
            ...inputInfo,
            id: currentUser.investorInfo.id,
            createdAt: currentUser.investorInfo.createdAt,
            updatedAt: new Date().toISOString(),
            investmentPreferences: inputInfo.investmentPreferences || 
              currentUser.investorInfo.investmentPreferences || [],
            investmentHistory: inputInfo.investmentHistory || 
              currentUser.investorInfo.investmentHistory || [],
            portfolioSize: new Double(
              Number(inputInfo.portfolioSize ?? currentUser.investorInfo.portfolioSize ?? 0)
            ),
            riskTolerance: inputInfo.riskTolerance || 
              currentUser.investorInfo.riskTolerance || 'MODERATE',
            preferredInvestmentDuration: inputInfo.preferredInvestmentDuration || 
              currentUser.investorInfo.preferredInvestmentDuration || 'MEDIUM',
            totalSpend: new Double(
              Number(inputInfo.totalSpend ?? currentUser.investorInfo.totalSpend ?? 0)
            )
          };
        }

        // Process baseProfile
        let processedBaseProfile = null;
        if (input.baseProfile || currentUser.baseProfile) {
          const inputProfile = input.baseProfile || {};
          processedBaseProfile = {
            ...currentUser.baseProfile,
            ...inputProfile,
            id: currentUser.baseProfile.id,
            displayName: inputProfile.displayName || currentUser.baseProfile.displayName,
            displayRole: inputProfile.displayRole || currentUser.baseProfile.displayRole,
            photoUrl: inputProfile.photoUrl || currentUser.baseProfile.photoUrl || '',
            bio: inputProfile.bio || currentUser.baseProfile.bio || '',
            createdAt: currentUser.baseProfile.createdAt,
            updatedAt: new Date().toISOString()
          };
        }

        // Prepare update object
        const updateData = {
          ...input,
          updatedAt: new Date().toISOString(),
          baseProfile: processedBaseProfile,
          investorInfo: processedInvestorInfo,
          uuid: currentUser.uuid,
          verificationToken: currentUser.verificationToken,
          socialLinks: currentUser.socialLinks || {
            twitter: '',
            instagram: '',
            website: ''
          }
        };

        console.log('Final update data:', JSON.stringify(updateData, null, 2));

        // Perform the update with more detailed error handling
        let result;
        try {
          result = await collection.findOneAndUpdate(
            { _id: new ObjectId(user._id) },
            { $set: updateData },
            { 
              returnDocument: 'after'
            }
          );
        } catch (updateError: any) {
          console.error('Direct update error:', updateError);
          throw new GraphQLError(`Update operation failed: ${updateError.message}`);
        }

        // If update succeeded but didn't return the document, fetch it manually
        if (!result?.value) {
          const updatedUser = await collection.findOne({ 
            _id: new ObjectId(user._id) 
          });
          
          if (!updatedUser) {
            throw new GraphQLError('Failed to retrieve updated user');
          }
          
          return updatedUser;
        }

        return result.value;
      } catch (error: any) {
        console.error('Update error details:', {
          message: error.message,
          code: error.code,
          validationErrors: error.errInfo?.details?.schemaRulesNotSatisfied,
          stack: error.stack
        });

        throw new GraphQLError(
          error.message || 'Failed to update user',
          {
            extensions: {
              code: error.code || 'UPDATE_ERROR',
              details: error.errInfo?.details || error.message
            }
          }
        );
      }
    },
  },
};