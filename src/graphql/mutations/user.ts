import { gql } from '@apollo/client'


export const REGISTER_USER = gql`
  mutation Register(
    $email: String
    $firstName: String
    $lastName: String
    $country: String
    $acceptTerms: String
  ) {
    register(
      email: $email
      firstName: $firstName
      lastName: $lastName
      country: $country
      acceptTerms: $acceptTerms
    ) {
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
        createdAt
        updatedAt
        lastLogin
        isActive
        role
        isVerified
        phoneNumber
        paraSession
        kycInfo {
          kycStatus
        }
        investorInfo {
          id
          portfolioSize
          totalSpend
        }
      }
    }
  }
`

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
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

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

export const LOGIN_USER = gql`
  mutation Login {
    login {
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
        createdAt
        updatedAt
        lastLogin
        isActive
        role
        isVerified
        phoneNumber
        paraSession
        kycInfo {
          idvId
          kycStatus
          kycCompletionDate
        }
      }
    }
  }
`

export const CHECK_USER_QUERY = gql`
    query IsUserRegistered($publicKey: String!) {
      isUserRegistered(publicKey: $publicKey)
    }
`;

export const SUBSCRIBE_EMAIL = gql`
  mutation SubscribeEmail($email: String!) {
    subscribeEmail(email: $email) {
      success
      message
    }
  }
`;