import { gql } from 'graphql-tag'

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
  }

  input CreateUserInput {
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
    kycInfo: UpdateKYCInfoInput
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
    kycInfo: UpdateKYCInfoInput
    socialLinks: UpdateSocialLinksInput
  }

  input UpdateSocialLinksInput {
    twitter: String
    instagram: String
    website: String
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

  type Mutation {
    register(input: RegisterInput!): AuthPayload!

    updateUser(input: UpdateUserInput!): User!

    login(publicKey: String!, password: String!): AuthPayload!

    createUser(input: CreateUserInput!): User!
  }
`
