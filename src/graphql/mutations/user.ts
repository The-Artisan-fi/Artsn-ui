import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      _id
      uuid
      email
      publicKey
      username
      firstName
      lastName
      country
      role
      isActive
      isVerified
      baseProfile {
        id
        displayName
        displayRole
      }
      investorInfo {
        id
        portfolioSize
        totalSpend
      }
      kycInfo {
        kycStatus
      }
    }
  }
`

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        _id
        uuid
        email
        username
        firstName
        lastName
        role
        publicKey
        createdAt
        updatedAt
        isActive
        isVerified
        baseProfile {
          id
          displayName
          displayRole
          photoUrl
          bio
          createdAt
          updatedAt
        }
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      uuid
      email
      publicKey
      username
      firstName
      lastName
      country
      role
      isActive
      isVerified
      createdAt
      updatedAt
      baseProfile {
        id
        displayName
        displayRole
        photoUrl
        bio
        createdAt
        updatedAt
      }
      investorInfo {
        id
        investmentPreferences
        portfolioSize
        riskTolerance
        preferredInvestmentDuration
        totalSpend
        createdAt
        updatedAt
      }
      kycInfo {
        idvId
        kycStatus
        kycCompletionDate
      }
    }
  }
`

export const LOGIN_USER = gql`
  mutation LoginUser($publicKey: String!, $password: String!) {
    login(publicKey: $publicKey, password: $password) {
      token
      user {
        _id
        uuid
        email
        publicKey
        username
        firstName
        lastName
        country
        role
        isActive
        isVerified
        createdAt
        updatedAt
        baseProfile {
          id
          displayName
          displayRole
          photoUrl
          bio
        }
        investorInfo {
          id
          investmentPreferences
          portfolioSize
          riskTolerance
          preferredInvestmentDuration
          totalSpend
        }
        kycInfo {
          idvId
          kycStatus
          kycCompletionDate
        }
      }
    }
  }
`
