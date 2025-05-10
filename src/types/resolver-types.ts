// src/types/resolver-types.ts
import { NextRequest } from 'next/server'
import { Db } from 'mongodb'
import mongoose from 'mongoose'

export interface User {
  _id?: string
  uuid: string
  email: string
  username: string
  publicKey: string
  firstName?: string
  lastName?: string
  country?: string
  investorInfo?: any
  createdAt: string
  updatedAt: string
  lastLogin?: string
  isActive: boolean
  isVerified: boolean
  role: string
  verificationToken?: string
  solanaTransactionId?: string
  phoneNumber?: string
  kycInfo?: any
  paraSession?: string
}


export interface Context {
  req: NextRequest
  res?: Response
  db: Db
  user?: User
  mongoose: typeof mongoose
}

export interface AuthPayload {
  token: string
  user: User
  response?: any
}

export interface ListingType {
  _id: string
  associatedId: string
  assetDetails: string
  earningPotential: number
  earningPotentialDuration: string
  expectedNetReturn: number
  images: string[]
  marketValue: number
  pastReturns: number
  currency: string
  model: string
  offerViews: number
  sold: boolean
  total: number
  mintAddress: string
  about: string
}
