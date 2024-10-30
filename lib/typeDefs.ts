import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID!
    uuid: String!
    email: String
    password: String
    username: String
    firstName: String
    lastName: String
    createdAt: String
    updatedAt: String
    lastLogin: String
    isActive: Boolean
    role: String!
    country: String
    isVerified: Boolean
    publicKey: String
    solanaTransactionId: String
    phoneNumber: String
    baseProfile: BaseProfile
    investorInfo: InvestorInfo
    kycInfo: KYCInfo
  }

  type BaseProfile {
    id: ID
    displayName: String
    displayRole: String
    photoUrl: String
    bio: String
    createdAt: String
    updatedAt: String
  }

  type InvestorInfo {
    id: ID
    createdAt: String
    updatedAt: String
    investmentPreferences: [String]
    investmentHistory: [InvestmentHistoryItem]
    portfolioSize: Float
    riskTolerance: String
    preferredInvestmentDuration: String
  }

  type InvestmentHistoryItem {
    id: ID!
    type: String!
    investmentDate: String!
    amount: Float!
    transactionId: String
  }

  type KYCInfo {
    kycStatus: String!
    kycCompletionDate: String
    kycDocuments: [KYCDocument]
  }

  type KYCDocument {
    documentType: String!
    documentUrl: String!
    verificationStatus: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    uuid: String!
    email: String
    password: String
    username: String
    firstName: String
    lastName: String
    createdAt: String
    updatedAt: String
    lastLogin: String
    isActive: Boolean
    role: String!
    country: String
    isVerified: Boolean
    publicKey: String
    solanaTransactionId: String
    phoneNumber: String
    baseProfile: UpdateBaseProfileInput
    investorInfo: UpdateInvestorInfoInput
  }

  input UpdateUserInput {
    username: String
    firstName: String
    lastName: String
    role: String
    publicKey: String
    country: String
    baseProfile: UpdateBaseProfileInput
    investorInfo: UpdateInvestorInfoInput
  }

  input UpdateBaseProfileInput {
    displayName: String
    displayRole: String
    photoUrl: String
    bio: String
  }

  input UpdateInvestorInfoInput {
    investmentPreferences: [String]
    investmentHistory: [InvestmentHistoryItemInput]
    portfolioSize: Float
    riskTolerance: String
    preferredInvestmentDuration: String
  }

  input InvestmentHistoryItemInput {
    type: String
    investmentDate: String
    amount: Float
    terms: String
    transactionId: String
    creatorId: String
    ipId: String
  }

  type Listing {
    associatedId: String!
    images: [String!]
    assetDetails: String
    expectedNetReturn: String
    marketValue: String
    pastReturns: String
    earningPotential: String
    earningPotentialDuration: String
    reference: String
    currency: String
    description: String
    model: String
    totalViews: String
    totalShares: String
    totalLikes: String
    sold: Int
    total: Int
    mintAddress: String
    about: String
  }

  type Query {
    me: User
    isUserRegistered(publicKey: String!): Boolean!
    checkEmail(email: String!): User
    getListing(associatedId: String!): Listing
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!

    updateUser(input: UpdateUserInput!): User!

    login(publicKey: String!, password: String!): AuthPayload!

    resetPassword(token: String!, newPassword: String!): Boolean!
    
    requestPasswordReset(email: String!): Boolean!

  }
`;