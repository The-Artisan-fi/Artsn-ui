import { gql } from 'graphql-tag'

export const typeDefs = gql`
  scalar JSON

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
    investorInfo: InvestorInfo
    kycInfo: KYCInfo
    paraSession: String
  }

  type SocialLinks {
    twitter: String
    instagram: String
    website: String
  }

  type InvestorInfo {
    id: String
    createdAt: String
    updatedAt: String
    investmentPreferences: [String]
    investmentHistory: [InvestmentHistoryItem]
    portfolioSize: Float
    riskTolerance: String
    preferredInvestmentDuration: String
    totalSpend: Float
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
    idvId: String
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
    response: JSON
  }

  type SubscriptionResponse {
    success: Boolean!
    message: String!
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
    investorInfo: UpdateInvestorInfoInput
    kycInfo: UpdateKYCInfoInput
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    role: String
    publicKey: String
    country: String
    email: String
    investorInfo: UpdateInvestorInfoInput
    kycInfo: UpdateKYCInfoInput
    socialLinks: UpdateSocialLinksInput
  }

  input UpdateSocialLinksInput {
    instagram: String
    twitter: String
    linkedin: String
    website: String
  }

  input UpdateInvestorInfoInput {
    investmentPreferences: [String]
    investmentHistory: [InvestmentHistoryItemInput]
    portfolioSize: Float
    riskTolerance: String
    preferredInvestmentDuration: String
    totalSpend: Float
  }

  input InvestmentHistoryItemInput {
    type: String
    investmentDate: String
    amount: Float
    transactionId: String
  }

  input UpdateKYCInfoInput {
    idvId: String
    kycStatus: String
    kycCompletionDate: String
    kycDocuments: [KYCDocumentInput]
  }

  input KYCDocumentInput {
    documentType: String
    documentUrl: String
    verificationStatus: String
  }

  input ListingSortInput {
    expectedNetReturn: Int
    createdAt: Int
    sold: Int
  }

  type Listing {
    _id: ID!
    assetDetails: String
    associatedId: String
    earningPotential: Float
    earningPotentialDuration: String
    expectedNetReturn: Float
    images: [String]
    marketValue: Float
    pastReturns: Float
    currency: String
    model: String
    offerViews: Int
    sold: Int
    total: Float
    mintAddress: String
    about: String
    type: String
    createdAt: String
  }

  type Query {
    me: User
    isUserRegistered(publicKey: String!): Boolean!
    checkEmail(email: String!): User
    getListing(associatedId: String!): Listing
    getAllListings(sort: ListingSortInput, limit: Int, offset: Int): [Listing!]!
    getListingsByNetReturn(limit: Int, offset: Int): [Listing!]!
    getRecentListings(limit: Int, offset: Int): [Listing!]!
    getMostSoldListings(limit: Int, offset: Int): [Listing!]!
  }

  input LoginInput {
    session: String!
  }

  type Mutation {
    updateUser(id: ID!, input: UpdateUserInput!): User
    deleteUser(id: ID!): Boolean
    login: AuthPayload
    register(
      email: String
      firstName: String
      lastName: String
      country: String
      acceptTerms: String
    ): AuthPayload
    updateParaSession: User
    subscribeEmail(email: String!): SubscriptionResponse!
  }
`