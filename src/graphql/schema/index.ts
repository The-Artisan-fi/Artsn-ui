import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID
    uuid: String
    email: String
    publicKey: String
    username: String
    firstName: String
    lastName: String
    country: String
    createdAt: String
    updatedAt: String
    lastLogin: String
    isActive: Boolean
    role: String
    verificationToken: String
    isVerified: Boolean
    solanaTransactionId: String
    phoneNumber: String
    socialLinks: SocialLinks
    baseProfile: BaseProfile
    investorInfo: InvestorInfo
    kycInfo: KYCInfo
  }

  type SocialLinks {
    twitter: String
    instagram: String
    website: String
  }

  type BaseProfile {
    id: String!
    displayName: String!
    displayRole: String!
    photoUrl: String
    bio: String
    createdAt: String!
    updatedAt: String!
  }

  type InvestorInfo {
    id: String!
    createdAt: String!
    updatedAt: String!
    investmentPreferences: [String]
    investmentHistory: [InvestmentHistoryItem]
    portfolioSize: Float!
    riskTolerance: String!
    preferredInvestmentDuration: String!
    totalSpend: Float!
  }

  type InvestmentHistoryItem {
    id: String!
    type: String!
    investmentDate: String!
    amount: Float!
    terms: String!
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

  input CreateUserInput {
    email: String!
    publicKey: String!
    password: String!
    username: String!
    firstName: String!
    lastName: String!
    country: String!
    isActive: Boolean
    isVerified: Boolean
    role: String!
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
    firstName: String
    lastName: String
    role: String
    publicKey: String
    country: String
    email: String
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
    transactionId: String
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
    type: String
  }

  type Query {
    me: User
    isUserRegistered(publicKey: String!): Boolean!
    checkEmail(email: String!): User
    getListing(associatedId: String!): Listing
    getAllListings: [Listing]
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!

    updateUser(input: UpdateUserInput!): User!

    login(publicKey: String!, password: String!): AuthPayload!

    createUser(input: CreateUserInput!): User!
  }
`;
