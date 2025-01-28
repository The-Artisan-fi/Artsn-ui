// src/types/resolver-types.ts
import { NextRequest } from 'next/server'
import { Db } from 'mongodb'

export interface User {
  _id?: string
  uuid: string
  email: string
  username: string
  publicKey: string
  firstName?: string
  lastName?: string
  investorInfo?: any
  baseProfile?: any
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
}

export interface CreateUserInput {
  email: string
  publicKey: string
  password: string
  country: string
  username: string
  firstName?: string
  lastName?: string
  investorInfo?: any
  baseProfile?: any
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
}

export interface Context {
  req: NextRequest
  db: Db
  user: User | null
}

export interface AuthPayload {
  token: string
  user: User
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
