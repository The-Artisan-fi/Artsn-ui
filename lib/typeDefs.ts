import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    _id: ID!
    uuid: String!
    email: String!
    password: String!
    username: String
    firstName: String
    lastName: String
    createdAt: String!
    updatedAt: String!
    lastLogin: String
    isActive: Boolean!
    role: String!
    country: String
    acceptTerms: String
    plan: String
    verificationToken: String
    isVerified: Boolean!
    coverImageUrl: String
    profilePictureUrl: String
    publicKey: String
    solanaTransactionId: String
    phoneNumber: String
    baseProfile: BaseProfile
    creatorInfo: CreatorInfo
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

  type CreatorInfo {
    id: ID
    createdAt: String
    updatedAt: String
    detailedBio: DetailedBio
    ipAssets: [String]
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
    terms: String
    transactionId: String
    creatorId: String
    ipId: String
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

  type EmploymentContract {
    employer: String!
    startDate: String
    endDate: String
    ipRightsInfo: String
  }

  type School {
    name: String!
    degree: String
    fieldOfStudy: String
    graduationYear: String
  }

  type Education {
    schools: [School]
    relevantCourses: [String]
    specializedTraining: [String]
  }

  type ProfessionalAchievements {
    awards: [String]
    exhibitions: [String]
    portfolioLinks: [String]
  }

  type DetailedBio {
    profession: String
    education: Education
    professionalAchievements: ProfessionalAchievements
    collaborators: [String]
    employmentContracts: [EmploymentContract]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    uuid: String!
    email: String!
    password: String!
    username: String!
    firstName: String
    lastName: String
    role: String!
    profilePictureUrl: String
    publicKey: String
  }

  input UpdateUserInput {
    username: String
    firstName: String
    lastName: String
    role: String
    profilePictureUrl: String
    publicKey: String
    country: String
    acceptTerms: String
    plan: String
    baseProfile: UpdateBaseProfileInput
    creatorInfo: UpdateCreatorInfoInput
    investorInfo: UpdateInvestorInfoInput
  }

  input UpdateBaseProfileInput {
    displayName: String
    displayRole: String
    photoUrl: String
    bio: String
  }

  input UpdateCreatorInfoInput {
    detailedBio: UpdateDetailedBioInput
    ipAssets: [String]
  }

  input UpdateDetailedBioInput {
    profession: String
    education: EducationInput
    professionalAchievements: ProfessionalAchievementsInput
    collaborators: [String]
    employmentContracts: [EmploymentContractInput]
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

  type IPAsset {
    _id: ID!
    uuid: String!
    creatorId: String!
    name: String!
    description: String!
    videoLink: String
    fileLink: String!
    blockchainId: String!
    proofHash: String!
    status: String!
    type: String!
    subtype: String!
    rightsReserved: String!
    publicInformation: String!
    creativeProcess: String!
    contentDeclaration: String!
    aiReadiness: String!
    commercialTerms: String
    collaborators: [String!]!
    tags: [String!]!
    createdAt: String!
    updatedAt: String!
    totalViews: Int!
    totalLikes: Int!
    totalShares: Int!
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
    offerViews: String
    sold: Int
    total: Int
    mintAddress: String
    about: String
  }

  input IPAssetInput {
    creatorId: String!
    name: String!
    description: String!
    videoLink: String
    fileLink: String!
    blockchainId: String!
    proofHash: String!
    status: String!
    type: String!
    subtype: String!
    rightsReserved: String!
    publicInformation: String!
    creativeProcess: String!
    contentDeclaration: String!
    aiReadiness: String!
    commercialTerms: String
    collaborators: [String!]
    tags: [String!]
  }
  enum IPAssetStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  enum IPAssetType {
    ACCESSORIES
    ARCHITECTURE
    CRAFT
    DIGITAL
    FASHION
    FILM
    FINE_ART
    INTERIORS
    JEWELRY
    PHOTOGRAPHY
    PRODUCT
    TEXTILES
    VISUAL_COMMUNICATION
  }

  enum RightsReservedType {
    ALL_RIGHTS_RESERVED
    SOME_RIGHTS_RESERVED
  }

  enum PublicInformationType {
    NO_PUBLIC_INFORMATION
    ONLY_REGISTRATION_INFO
    WITH_PREVIEW
    WITH_ORIGINAL_DOWNLOAD
    WITH_INFO_DOWNLOAD
  }

  enum CreativeProcessType {
    NOT_DECLARED
    HUMAN_CREATION
    AI_CREATION
    AI_ASSISTED
  }

  enum ContentDeclarationType {
    NOT_DECLARED
    REAL_CONTENT
    FICTIONAL_CONTENT
  }

  enum AIReadinessType {
    NOT_DECLARED
    NOT_AVAILABLE
    AVAILABLE_WITH_AGREEMENT
    FREELY_AVAILABLE
  }

  input CreatorInfoInput {
    detailedBio: DetailedBioInput!
    ipAssets: [String]
  }

  input DetailedBioInput {
    profession: String
    education: EducationInput
    professionalAchievements: ProfessionalAchievementsInput
    collaborators: [String]
    employmentContracts: EmploymentContractInput
  }

  input EducationInput {
    schools: [SchoolInput]
    relevantCourses: [String]
    specializedTraining: [String]
  }

  input SchoolInput {
    name: String
    degree: String
    fieldOfStudy: String
    graduationYear: String
  }

  input ProfessionalAchievementsInput {
    awards: [String]
    exhibitions: [String]
    portfolioLinks: [String]
  }

  input EmploymentContractInput {
    employer: String
    startDate: String
    endDate: String
    ipRightsInfo: String
  }

  type Query {
    me: User
    getIP(uuid: String!): IPAsset
    getAllIPs: [IPAsset!]!
    isUserRegistered(publicKey: String!): Boolean!
    checkEmail(email: String!): User
    getListing(associatedId: String!): Listing
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!

    updateUser(input: UpdateUserInput!): User!

    addCreatorProfile(uuid: String!, publicKey: String!, creatorInfo: CreatorInfoInput!): User!

    login(publicKey: String!, password: String!): AuthPayload!

    resetPassword(token: String!, newPassword: String!): Boolean!
    
    requestPasswordReset(email: String!): Boolean!

    createIPAsset(input: IPAssetInput!): IPAsset!
  }
`;