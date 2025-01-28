import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/config/mongodb'
import { Context } from '@/types/resolver-types'
import { IResolvers } from '@graphql-tools/utils'
import { UserModel } from '../models/User'
import { CreateUserInput } from '@/types/resolver-types'
import { ApolloError } from 'apollo-server-micro'
import { v4 as uuidv4 } from 'uuid'
import { UserService } from '@/lib/db/utils'
import { Double } from 'mongodb'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

export const userResolvers: IResolvers<any, Context> = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated')
      }
      try {
        const { db } = await connectToDatabase()
        const user = await db
          .collection('users')
          .findOne({ _id: new ObjectId(context.user._id) })
        if (!user) {
          throw new Error('User not found')
        }
        return user
      } catch (error) {
        console.error('Error in me query:', error)
        throw new Error('Failed to fetch user')
      }
    },

    isUserRegistered: async (
      _parent: any,
      { publicKey }: { publicKey: string }
    ) => {
      try {
        const { db } = await connectToDatabase()
        const user = await db.collection('users').findOne({ publicKey })
        return !!user
      } catch (error) {
        console.error('Error checking user registration:', error)
        return false
      }
    },
  },

  Mutation: {
    login: async (
      _: any,
      { publicKey, password }: { publicKey: string; password: string }
    ) => {
      try {
        console.log('Login attempt with publicKey:', publicKey)

        const { db } = await connectToDatabase()
        const usersCollection = db.collection('users')

        const user = await usersCollection.findOne({ publicKey })
        console.log('Found user:', user ? 'yes' : 'no')

        if (!user) {
          console.error('User not found for publicKey:', publicKey)
          throw new Error('Invalid credentials')
        }

        // const isValid = await compare(password, user.password);
        const isValid = password === user.publicKey
        if (!isValid) {
          console.error('Password validation failed')
          throw new Error('Invalid credentials')
        }

        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET not configured')
        }

        const token = jwt.sign(
          {
            _id: user._id.toString(),
            publicKey: user.publicKey,
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        )

        return {
          token,
          user: {
            ...user,
            _id: user._id.toString(),
          },
        }
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    createUser: async (_: any, { input }: { input: any }, { db }: Context) => {
      try {
        const users = db.collection('users')

        // Log the validation schema to debug
        const collections = await db
          .listCollections({ name: 'users' })
          .toArray()
        console.log(
          'Schema validation:',
          JSON.stringify((collections[0] as any).options?.validator, null, 2)
        )

        // Check if user exists
        const existingUser = await users.findOne({ publicKey: input.publicKey })
        if (existingUser) {
          throw new Error('User with this public key already exists')
        }

        // Generate IDs for required nested objects
        const baseProfileId = uuidv4()
        const investorInfoId = uuidv4()
        const now = new Date().toISOString()

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
            website: '',
          },

          baseProfile: {
            id: baseProfileId, // Required by schema
            displayName: input.username || `user_${input.publicKey.slice(-4)}`,
            displayRole: input.role || 'USER',
            photoUrl:
              'https://monaco-public.s3.eu-central-1.amazonaws.com/671a01ed57cfa29934ac5606/b824143e-f6c4-4b29-87f7-42519fd6556e/0',
            bio: '',
            createdAt: now,
            updatedAt: now,
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
            totalSpend: new Double(0.0),
          },

          kycInfo: {
            idvId: '',
            kycStatus: 'PENDING',
            kycCompletionDate: now,
            kycDocuments: [],
          },
        }

        // Log the document we're trying to insert
        console.log(
          'Attempting to insert document:',
          JSON.stringify(newUser, null, 2)
        )

        const result = await users.insertOne(newUser)

        if (!result.acknowledged) {
          throw new Error('Failed to create user')
        }

        const savedUser = await users.findOne({ _id: result.insertedId })
        if (!savedUser) {
          throw new Error('Failed to retrieve created user')
        }

        // Remove sensitive data before returning
        const { password: _, ...userWithoutPassword } = savedUser
        return userWithoutPassword
      } catch (error: any) {
        console.error('Error creating user:', {
          message: error.message,
          code: error.code,
          errInfo: error.errInfo,
        })

        // If it's a validation error, log more details
        if (error.code === 121) {
          console.error(
            'Validation failure details:',
            JSON.stringify(
              error.errInfo?.details?.schemaRulesNotSatisfied,
              null,
              2
            )
          )
        }

        throw error
      }
    },
    updateUser: async (
      _: any,
      { input }: { input: any },
      { db, user }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      try {
        const collection = db.collection('users')

        // Get current user data
        const currentUser = await collection.findOne({
          _id: new ObjectId(user._id),
        })

        if (!currentUser) {
          throw new GraphQLError('User not found')
        }

        const now = new Date().toISOString()

        // Prepare update object with all required fields
        const updateData = {
          // Required fields from schema
          email: input.email || currentUser.email,
          password: currentUser.password,
          uuid: currentUser.uuid,
          username: currentUser.username,
          firstName: input.firstName || currentUser.firstName,
          lastName: input.lastName || currentUser.lastName,
          country: input.country || currentUser.country,

          // Optional fields
          createdAt: currentUser.createdAt,
          updatedAt: now,
          lastLogin: currentUser.lastLogin || now,
          isActive: currentUser.isActive ?? true,
          role: currentUser.role || 'USER',
          verificationToken: currentUser.verificationToken || '',
          isVerified: currentUser.isVerified ?? false,
          publicKey: currentUser.publicKey,
          solanaTransactionId: currentUser.solanaTransactionId || '',
          phoneNumber: currentUser.phoneNumber || '',

          // Nested objects
          socialLinks: {
            twitter:
              input.socialLinks?.twitter ||
              currentUser.socialLinks?.twitter ||
              '',
            instagram:
              input.socialLinks?.instagram ||
              currentUser.socialLinks?.instagram ||
              '',
            website:
              input.socialLinks?.website ||
              currentUser.socialLinks?.website ||
              '',
          },

          baseProfile: {
            id: currentUser.baseProfile?.id || crypto.randomUUID(),
            displayName:
              input.baseProfile?.displayName ||
              currentUser.baseProfile?.displayName ||
              currentUser.username,
            displayRole:
              input.baseProfile?.displayRole ||
              currentUser.baseProfile?.displayRole ||
              'USER',
            photoUrl:
              input.baseProfile?.photoUrl ||
              currentUser.baseProfile?.photoUrl ||
              '',
            bio: input.baseProfile?.bio || currentUser.baseProfile?.bio || '',
            createdAt: currentUser.baseProfile?.createdAt || now,
            updatedAt: now,
          },

          investorInfo: {
            id: currentUser.investorInfo?.id || crypto.randomUUID(),
            createdAt: currentUser.investorInfo?.createdAt || now,
            updatedAt: now,
            investmentPreferences:
              input.investorInfo?.investmentPreferences ||
              currentUser.investorInfo?.investmentPreferences ||
              [],
            investmentHistory:
              input.investorInfo?.investmentHistory ||
              currentUser.investorInfo?.investmentHistory ||
              [],
            portfolioSize: new Double(
              Number(
                input.investorInfo?.portfolioSize ||
                  currentUser.investorInfo?.portfolioSize ||
                  0
              )
            ),
            riskTolerance:
              input.investorInfo?.riskTolerance ||
              currentUser.investorInfo?.riskTolerance ||
              'MODERATE',
            preferredInvestmentDuration:
              input.investorInfo?.preferredInvestmentDuration ||
              currentUser.investorInfo?.preferredInvestmentDuration ||
              'MEDIUM',
            totalSpend: new Double(
              Number(
                input.investorInfo?.totalSpend ||
                  currentUser.investorInfo?.totalSpend ||
                  0
              )
            ),
          },

          kycInfo: {
            idvId: input.kycInfo?.idvId || currentUser.kycInfo?.idvId || '',
            kycStatus:
              input.kycInfo?.kycStatus ||
              currentUser.kycInfo?.kycStatus ||
              'PENDING',
            kycCompletionDate: currentUser.kycInfo?.kycCompletionDate || now,
            kycDocuments: currentUser.kycInfo?.kycDocuments || [],
          },
        }

        // Perform the update and handle the result properly
        const result = await collection.findOneAndUpdate(
          { _id: new ObjectId(user._id) },
          { $set: updateData },
          {
            returnDocument: 'after',
          }
        )

        // Log the result structure for debugging
        console.log('Update result:', JSON.stringify(result, null, 2))

        // Handle different result formats
        const updatedUser =
          result?.value ||
          (result?.lastErrorObject?.updatedExisting &&
            (await collection.findOne({ _id: new ObjectId(user._id) })))

        if (!updatedUser) {
          // If we still can't get the updated user, try one more time to fetch it
          const finalAttempt = await collection.findOne({
            _id: new ObjectId(user._id),
          })
          if (!finalAttempt) {
            throw new GraphQLError('Failed to retrieve updated user')
          }
          return finalAttempt
        }

        return updatedUser
      } catch (error: any) {
        console.error('MongoDB Error:', {
          message: error.message,
          code: error.code,
          name: error.name,
          stack: error.stack,
        })

        if (error.code === 121) {
          const validationErrors =
            error.errInfo?.details?.schemaRulesNotSatisfied
          console.error('Validation Error Details:', {
            validationErrors,
            operatorName: error.errInfo?.details?.operatorName,
            failingDocumentId: error.errInfo?.failingDocumentId,
          })
        }

        throw new GraphQLError('Failed to update user: ' + error.message, {
          extensions: {
            code: error.code || 'UPDATE_ERROR',
            details: error.errInfo?.details || error.message,
          },
        })
      }
    },
  },
}
