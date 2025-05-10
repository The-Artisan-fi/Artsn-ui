import { ObjectId } from 'mongodb'
import { getDb } from '@/config/mongodb'
import { Context, User } from '@/types/resolver-types'
import { IResolvers } from '@graphql-tools/utils'
import { UserModel } from '../models/User'
import { ApolloError } from 'apollo-server-micro'
import { v4 as uuidv4 } from 'uuid'
import { UserService } from '@/lib/db/utils'
import { Double } from 'mongodb'
import { GraphQLError } from 'graphql'
import { decodeParaSession } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { Para as ParaServer, Environment } from "@getpara/server-sdk";
import { getIronSession } from 'iron-session'
import { sessionOptions, generateToken, SessionData, sealSession } from '@/lib/session'
import { createHash } from 'crypto'
import mailchimp from '@mailchimp/mailchimp_marketing';
import {
  PublicKey,
  SystemProgram,
  Keypair,
  TransactionMessage,
  VersionedTransaction,
  Connection,
} from '@solana/web3.js'
import * as b58 from 'bs58'
import { AnchorProvider } from '@coral-xyz/anchor'
import { getArtisanProgram } from '@/components/blockchain/artisan-exports'
import { rpcManager } from '@/lib/rpc/rpc-manager'


export const userResolvers: IResolvers<any, Context> = {
  Query: {
    me: async (_: any,  context: Context) => {
      if (!context.user) {
        throw new ApolloError('Not authenticated', 'UNAUTHENTICATED');
      }
      try {
        const para = new ParaServer(Environment.BETA, process.env.NEXT_PUBLIC_PARA_API_KEY as string);

        // Get Capsule session from headers
        const capsuleSession = context.req?.headers.get('x-capsule-session');
        if (capsuleSession) {
            try { 
              await context.db.collection('users').updateOne(
                { _id: new ObjectId(context.user._id) },
                { $set: { paraSession: capsuleSession } }
              );
              await para.importSession(capsuleSession);
              const isSessionValid = await para.isSessionActive();
              if (!isSessionValid) {
                throw new GraphQLError('Invalid Capsule session');
              }
            } catch (error) {
              console.error('Invalid Capsule session:', error);
              throw new GraphQLError('Authentication failed', {
                extensions: {
                  code: 'UNAUTHENTICATED',
                  ...(process.env.NODE_ENV === 'development' && {
                    reason: 'Invalid Capsule session'
                  })
                }
              });
            }
          
          const { db } = context;
          const user = await db.collection('users').findOne({ _id: new ObjectId(context.user._id) });
          if (!user) {
            throw new ApolloError('User not found', 'NOT_FOUND');
          }
          return user;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        throw new ApolloError('Failed to fetch user', 'INTERNAL_SERVER_ERROR');
      }
    },

    isUserRegistered: async (_parent: any, { publicKey }: { publicKey: string }) => {
      try {
        const db = await getDb()
        const user = await db.collection('users').findOne({ publicKey });
        return !!user;
      } catch (error) {
        console.error('Error checking user registration:', error);
        return false;
      }
    },
  },

  
  Mutation: {
    login: async (_, __, context) => {
      try {
        console.log('Login attempt with session')

        // Log context for debugging
        console.log('Context request:', context.req ? 'present' : 'missing')
        console.log('Context response:', context.res ? 'present' : 'missing')
        
        let userPublicKey;

        // Get Capsule session from headers
        const capsuleSession = context.req?.headers.get('x-capsule-session');        
        if (!capsuleSession) {
          console.error('Login failed: No Capsule session found in headers');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'No Capsule session found in headers'
              })
            }
          });
        }

        const para = new ParaServer(Environment.BETA, process.env.NEXT_PUBLIC_PARA_API_KEY as string);

        // Validate the Para session
        await para.importSession(capsuleSession);
        console.log('validateParaSessionServer: Session imported successfully');
    
        // Check if the session is active
        const isSessionValid = await para.isSessionActive();
        
        if (!isSessionValid) {
          console.error('Login failed: Invalid or expired Para session');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'Invalid or expired Para session'
              })
            }
          });
        }
        
        if (para.wallets && typeof para.wallets === 'object' && Object.keys(para.wallets).length > 0) {
          const walletId = Object.keys(para.wallets)[0];
          console.log('Wallet ID:', walletId);
          userPublicKey = para.wallets[walletId].address;
        } else if (para.externalWallets && typeof para.externalWallets === 'object' && Object.keys(para.externalWallets).length > 0) {
          const externalWalletId = Object.keys(para.externalWallets)[0];
          console.log('External Wallet ID:', externalWalletId);
          userPublicKey = para.externalWallets[externalWalletId].address;
        }
        
        console.log('User public key from session:', userPublicKey);
        
        if (!userPublicKey) {
          console.error('Login failed: No public key found in session');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'No public key found in session'
              })
            }
          });
        }

        // Check if the user exists
        const db = await getDb();
        const usersCollection = db.collection('users');
        
        let user = await usersCollection.findOne({ publicKey: userPublicKey });
        
        if (!user) {
          console.error('Login failed: User not found');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'User not found'
              })
            }
          });
        }

        // Store a stringified version of the Para session
        const serializedParaSession = typeof capsuleSession === 'string' 
          ? capsuleSession 
          : JSON.stringify(capsuleSession);

        // Update user's last login time and Para session
        await usersCollection.updateOne(
          { _id: user._id },
          { 
            $set: { 
              lastLogin: new Date().toISOString(),
              paraSession: serializedParaSession
            } 
          }
        );

        // For authentication, generate a JWT token
        const token = generateToken(user);
        
        
        // Create session data with only JWT token to reduce cookie size
        const sessionData: SessionData = {
          isLoggedIn: true,
          _id: user._id.toString(),
          token // Include token for authentication
        };
        
        // Seal the session data
        let sealedSession;
        try {
          sealedSession = await sealSession(sessionData);
          console.log('Session sealed successfully, length:', sealedSession.length);
        } catch (sealError) {
          console.error('Error sealing session:', sealError);
          throw new GraphQLError('Failed to create session');
        }
        
        // Set the cookie directly on the context response if available
        if (context.res && context.res instanceof NextResponse) {
          // Set the cookie on the NextResponse object
          try {
            context.res.cookies.set({
              name: sessionOptions.cookieName,
              value: sealedSession,
              httpOnly: sessionOptions.cookieOptions.httpOnly,
              secure: sessionOptions.cookieOptions.secure,
              sameSite: sessionOptions.cookieOptions.sameSite as any,
              path: sessionOptions.cookieOptions.path,
              maxAge: sessionOptions.cookieOptions.maxAge
            });
            console.log('Cookie set successfully on GraphQL context response');
            
            // Also try setting it as a direct header for browsers that don't handle it through the context object
            const cookieString = `${sessionOptions.cookieName}=${sealedSession}; HttpOnly=${sessionOptions.cookieOptions.httpOnly}; Secure=${sessionOptions.cookieOptions.secure}; SameSite=${sessionOptions.cookieOptions.sameSite}; Path=${sessionOptions.cookieOptions.path}; Max-Age=${sessionOptions.cookieOptions.maxAge}`;
            context.res.headers.set('Set-Cookie', cookieString);
            console.log('Also set cookie via direct Set-Cookie header');
          } catch (error) {
            console.error('Failed to set cookie on context response:', error);
          }
        } else {
          console.warn('Cannot set cookie: NextResponse not available in context');
          console.log('Context res type:', context.res ? typeof context.res : 'undefined');
        }
                
        // // Create a response object for the GraphQL response
        // const responseObj = {
        //   success: true,
        //   token,
        //   user: {
        //     _id: user._id.toString(),
        //     publicKey: user.publicKey,
        //     email: user.email,
        //     role: user.role,
        //     paraSession: serializedParaSession
        //   }
        // };
        
        // Return the AuthPayload structure expected by the GraphQL schema
        return {
          token,
          user: {
            _id: user._id.toString(),
            uuid: user.uuid,
            email: user.email,
            publicKey: user.publicKey,
            username: user.username || `user_${user.publicKey.slice(0, 6)}`,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            country: user.country || '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLogin: new Date().toISOString(),
            isActive: user.isActive,
            role: user.role,
            isVerified: user.isVerified,
            phoneNumber: user.phoneNumber || '',
            paraSession: serializedParaSession
          },
          response: {
            success: true,
            sessionCookie: sealedSession // Include the sealed session for client-side cookie setting
          }
        };

      } catch (error) {
        console.error('Login error:', error);
        
        // If it's already a GraphQLError, preserve it in development
        if (error instanceof GraphQLError) {
          if (process.env.NODE_ENV === 'production') {
            // Strip sensitive details in production
            throw new GraphQLError('Authentication failed', {
              extensions: { code: 'UNAUTHENTICATED' }
            });
          }
          throw error;
        }

        // Generic error for unhandled cases
        throw new GraphQLError('Internal server error', {
          extensions: { 
            code: 'INTERNAL_SERVER_ERROR',
            ...(process.env.NODE_ENV === 'development' && {
              originalError: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        });
      }
    },
    updateUser: async (
      _: any,
      { id, input }: { id: string, input: any },
      { db, user, req }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      try {
        // Get Capsule session from headers
        const capsuleSession = req?.headers.get('x-capsule-session');        
        
        if (!capsuleSession) {
          console.error('Login failed: No Capsule session found in headers');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'No Capsule session found in headers'
              })
            }
          });
        }

        const para = new ParaServer(Environment.BETA, process.env.NEXT_PUBLIC_PARA_API_KEY as string);

        // Validate the Para session
        await para.importSession(capsuleSession);
        console.log('validateParaSessionServer: Session imported successfully');
    
        // Check if the session is active
        const isSessionValid = await para.isSessionActive();
        
        if (!isSessionValid) {
          console.error('Login failed: Invalid or expired Para session');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'Invalid or expired Para session'
              })
            }
          });
        }
        const collection = db.collection('users')

        // Get current user data
        const currentUser = await collection.findOne({
          _id: new ObjectId(id),
        })

        if (!currentUser) {
          throw new GraphQLError('User not found')
        }

        const now = new Date().toISOString()

        // Prepare update object with all required fields
        const updateData = {
          // Required fields from schema
          email: input.email || currentUser.email,
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
          role: currentUser.role || 'INVESTOR',
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
          { _id: new ObjectId(id) },
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
            (await collection.findOne({ _id: new ObjectId(id) })))

        if (!updatedUser) {
          // If we still can't get the updated user, try one more time to fetch it
          const finalAttempt = await collection.findOne({
            _id: new ObjectId(id),
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
    
    deleteUser: async (
      _: any,
      { id }: { id: string },
      { db, user, req }: Context
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated')
      }

      try {
        // Get Capsule session from headers
        const capsuleSession = req?.headers.get('x-capsule-session');        
        
        if (!capsuleSession) {
          console.error('Delete failed: No Capsule session found in headers');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'No Capsule session found in headers'
              })
            }
          });
        }

        const para = new ParaServer(Environment.BETA, process.env.NEXT_PUBLIC_PARA_API_KEY as string);

        // Validate the Para session
        await para.importSession(capsuleSession);
        console.log('validateParaSessionServer: Session imported successfully');
    
        // Check if the session is active
        const isSessionValid = await para.isSessionActive();
        
        if (!isSessionValid) {
          console.error('Delete failed: Invalid or expired Para session');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'Invalid or expired Para session'
              })
            }
          });
        }

        const collection = db.collection('users')

        // Get current user data
        const currentUser = await collection.findOne({
          _id: new ObjectId(id),
        })

        if (!currentUser) {
          throw new GraphQLError('User not found')
        }

        // Delete the user
        const result = await collection.deleteOne({
          _id: new ObjectId(id),
        })

        if (result.deletedCount === 0) {
          throw new GraphQLError('Failed to delete user')
        }

        return true
      } catch (error: any) {
        console.error('Error deleting user:', error)
        throw new GraphQLError('Failed to delete user: ' + error.message, {
          extensions: {
            code: error.code || 'DELETE_ERROR',
            details: error.errInfo?.details || error.message,
          },
        })
      }
    },
    register: async (_, { 
      email: providedEmail, 
      firstName, 
      lastName, 
      country, 
      acceptTerms
    }, context: Context) => {
      try {        
        let userEmail = providedEmail;
        let userPublicKey;

        const capsuleSession = context.req?.headers.get('x-capsule-session'); 
        if (!capsuleSession) {
          console.error('Login failed: No Capsule session found in headers');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'No Capsule session found in headers'
              })
            }
          });
        }
        
        const para = new ParaServer(Environment.BETA, process.env.NEXT_PUBLIC_PARA_API_KEY as string);
        console.log('capsuleSession REGISTER:', capsuleSession);
        // Validate the Para session
        await para.importSession(capsuleSession);
    
        // Check if the session is active
        const isSessionValid = await para.isSessionActive();

        console.log('validateParaSessionServerRegister: Session active status:', isSessionValid);
        if (!isSessionValid) {
          console.error('Registration failed: Invalid or expired Para session')
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'Invalid or expired Para session'
              })
            }
          })
        }
        
        if (para.wallets && typeof para.wallets === 'object' && Object.keys(para.wallets).length > 0) {
          const walletId = Object.keys(para.wallets)[0];
          console.log('Wallet ID:', walletId);
          userPublicKey = para.wallets[walletId].address;
        } else if (para.externalWallets && typeof para.externalWallets === 'object' && Object.keys(para.externalWallets).length > 0) {
          const externalWalletId = Object.keys(para.externalWallets)[0];
          console.log('External Wallet ID:', externalWalletId);
          userPublicKey = para.externalWallets[externalWalletId].address;
        }
        
        console.log('User public key from session:', userPublicKey);
        
        if (!userPublicKey) {
          console.error('Login failed: No public key found in session');
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'UNAUTHENTICATED',
              ...(process.env.NODE_ENV === 'development' && {
                reason: 'No public key found in session'
              })
            }
          });
        };
        
        try {          
          // Check if the user exists
          const db = await getDb()
          const usersCollection = db.collection('users')
          
          let user = await usersCollection.findOne({ publicKey: userPublicKey })
          
          if (!user) {
            const now = new Date().toISOString();
            const newUser = {
              uuid: para.userId,
              publicKey: userPublicKey, // Use the public key from the session
              email: userEmail, // Use the email prioritizing provided email
              firstName: firstName || '',
              lastName: lastName || '',
              country: country || '',
              acceptTerms: acceptTerms || now,
              role: 'Investor',
              createdAt: now,
              updatedAt: now,
              lastLogin: now,
              isActive: true,
              isVerified: false,
              paraSession: typeof capsuleSession === 'string' ? capsuleSession : JSON.stringify(capsuleSession), // Store the Para session as a string
              kycInfo: {
                idvId: '',
                kycStatus: 'Unverified',
                kycCompletionDate: now,
                kycDocuments: [],
              },
            };
            const result = await db.collection('users').insertOne(newUser);
            const insertedId = result.insertedId;
            user = { ...newUser, _id: insertedId };

            // Create on-chain profile
            try {
              const connection = rpcManager.getConnection()
              const wallet = Keypair.generate()
              // @ts-expect-error - wallet is dummy variable, signing is not needed
              const provider = new AnchorProvider(connection, wallet, {
                commitment: 'confirmed',
              })
              const program = getArtisanProgram(provider)

              const userPublicKeyObj = new PublicKey(userPublicKey)
              const profileArgs = {
                username: insertedId.toString(),
              }

              const userProfile = PublicKey.findProgramAddressSync(
                [Buffer.from('profile'), userPublicKeyObj.toBuffer()],
                program.programId
              )[0]

              const feePayer = getFeePayer()
              const profileInitIx = await createProfileInitInstruction(
                program,
                profileArgs,
                userPublicKeyObj,
                feePayer.publicKey,
                userProfile
              )

              const { blockhash, lastValidBlockHeight } =
                await connection.getLatestBlockhash('finalized')

              const messageV0 = new TransactionMessage({
                payerKey: feePayer.publicKey,
                recentBlockhash: blockhash,
                instructions: [profileInitIx],
              }).compileToV0Message()

              const txn = new VersionedTransaction(messageV0)
              txn.sign([feePayer])

              const transactionSignature = await connection.sendTransaction(txn)
              await connection.confirmTransaction(
                { blockhash, lastValidBlockHeight, signature: transactionSignature },
                'confirmed'
              )

              // Update user with transaction ID
              await usersCollection.updateOne(
                { _id: insertedId },
                { $set: { solanaTransactionId: transactionSignature } }
              )
            } catch (error) {
              console.error('Failed to create on-chain profile:', error)
              // Don't throw error, just continue with registration
            }
          }
          
          if (!user) {
            throw new GraphQLError('Failed to create or find user', {
              extensions: { code: 'INTERNAL_SERVER_ERROR' }
            });
          }
          
          // Store the serialized paraSession
          const serializedParaSession = typeof capsuleSession === 'string' 
            ? capsuleSession 
            : JSON.stringify(capsuleSession);
            
          // Convert MongoDB document to User type
          const userObj: User = {
            _id: user._id.toString(),
            uuid: user.uuid,
            email: user.email,
            username: user.username || `user_${user.publicKey.slice(0, 6)}`,
            publicKey: user.publicKey,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            country: user.country || '',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isActive: user.isActive,
            isVerified: user.isVerified,
            role: user.role,
            paraSession: serializedParaSession
          };
          
          const token = generateToken(userObj);
          
          // Create session data with minimal required fields
          const sessionData: SessionData = {
            isLoggedIn: true,
            _id: userObj._id,
            token // Include token for authentication
          };
          
          // Seal the session data
          let sealedSession;
          try {
            sealedSession = await sealSession(sessionData);
            console.log('Session sealed successfully, length:', sealedSession.length);
          } catch (sealError) {
            console.error('Error sealing session:', sealError);
            throw new GraphQLError('Failed to create session');
          }
          
          // Set the cookie directly on the context response if available
          if (context.res && context.res instanceof NextResponse) {
            // Set the cookie on the NextResponse object
            try {
              context.res.cookies.set({
                name: sessionOptions.cookieName,
                value: sealedSession,
                httpOnly: sessionOptions.cookieOptions.httpOnly,
                secure: sessionOptions.cookieOptions.secure,
                sameSite: sessionOptions.cookieOptions.sameSite as any,
                path: sessionOptions.cookieOptions.path,
                maxAge: sessionOptions.cookieOptions.maxAge
              });
              console.log('Cookie set successfully on GraphQL context response');
              
              // Also try setting it as a direct header for browsers that don't handle it through the context object
              const cookieString = `${sessionOptions.cookieName}=${sealedSession}; HttpOnly=${sessionOptions.cookieOptions.httpOnly}; Secure=${sessionOptions.cookieOptions.secure}; SameSite=${sessionOptions.cookieOptions.sameSite}; Path=${sessionOptions.cookieOptions.path}; Max-Age=${sessionOptions.cookieOptions.maxAge}`;
              context.res.headers.set('Set-Cookie', cookieString);
              console.log('Also set cookie via direct Set-Cookie header');
            } catch (error) {
              console.error('Failed to set cookie on context response:', error);
            }
          } else {
            console.warn('Context response not available for setting cookie');
          }

          return {
            token,
            user: userObj,
          };
        } catch (error) {
          console.error('Error validating Para session:', error)
          throw new GraphQLError('Authentication failed', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              ...(process.env.NODE_ENV === 'development' && {
                details: error instanceof Error ? error.message : String(error)
              })
            }
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        
        // If it's already a GraphQLError, preserve it in development
        if (error instanceof GraphQLError) {
          if (process.env.NODE_ENV === 'production') {
            // Strip sensitive details in production
            throw new GraphQLError('Registration failed', {
              extensions: { code: error.extensions?.code || 'INTERNAL_SERVER_ERROR' }
            });
          }
          throw error;
        }

        // Generic error for unhandled cases
        throw new GraphQLError('Registration failed', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            ...(process.env.NODE_ENV === 'development' && {
              originalError: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        })
      }
    },
    subscribeEmail: async (_, { email}: { email: string }) => {
      mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_API_SERVER,
      });
      if (!email) {
        return { success: false, message: 'Email is required.' };
      }

      const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
      if (!audienceId) {
        return { success: false, message: 'Audience ID is required.' };
      }

      try {
        // Check if email already exists
        const emailHash = createHash('md5').update(email.toLowerCase()).digest('hex');
        
        try {
          const existingMember = await mailchimp.lists.getListMember(audienceId, emailHash);
          if (existingMember.status === 'subscribed') {
            return { success: false, message: 'Email already subscribed.' };
          }
          // Handle other statuses if necessary (e.g., unsubscribed, cleaned)

        } catch (error: any) {
          // Check if the error is specifically a 404 Not Found, which is expected for new emails
          if (error.status === 404) {
            console.log(`Email ${email} not found in Mailchimp list ${audienceId}. Proceeding to add.`);
            // Do nothing here, just proceed to the addListMember call below
          } else {
            // If it's a different error (e.g., API key issue, network error), re-throw it
            console.error('Error checking Mailchimp list member:', error);
            throw new GraphQLError('Error checking email subscription status', {
              extensions: {
                code: 'MAILCHIMP_CHECK_ERROR',
                originalStatus: error.status,
                originalMessage: error.message
              }
            });
          }
        }

        // Add the member to the list (this runs if email wasn't found or had a non-subscribed status)
        console.log(`Attempting to add ${email} to Mailchimp list ${audienceId}`);
        await mailchimp.lists.setListMember(audienceId, emailHash,{
          email_address: email,
          status_if_new: 'subscribed',
        });

        console.log(`Successfully added ${email} to Mailchimp list.`);
        return { success: true, message: 'Subscription successful!' };
      
      } catch (error: any) {
        // Catch errors from the addListMember call or other unexpected issues
        console.error('Mailchimp subscription process error:', error);
        // Check if it's a Mailchimp API error with specific details
        const errorMessage = error.response?.body?.title || error.message || 'Something went wrong with the subscription.';
        const errorCode = error.response?.body?.status || 'MAILCHIMP_ADD_ERROR';

        return { 
          success: false, 
          message: errorMessage,
          // Optionally include more error details for debugging
          // extensions: { code: errorCode, details: error.response?.body?.detail }
        };
      }
    },
  },
}

function getFeePayer(): Keypair {
  const feeKey = process.env.PRIVATE_KEY!
  return Keypair.fromSecretKey(b58.decode(feeKey))
}

async function createProfileInitInstruction(
  program: any,
  profileArgs: any,
  userPublicKey: PublicKey,
  payerPublicKey: PublicKey,
  userProfile: PublicKey
) {
  return program.methods
    .initializeProfile(profileArgs)
    .accountsPartial({
      user: userPublicKey,
      payer: payerPublicKey,
      profile: userProfile,
      systemProgram: SystemProgram.programId,
    })
    .instruction()
}

