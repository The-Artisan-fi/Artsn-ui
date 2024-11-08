import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      _id
      uuid
      username
      email
      firstName
      lastName
      role
      createdAt
      publicKey
      solanaTransactionId
      baseProfile {
        displayName
        displayRole
        photoUrl
        bio
        createdAt
        updatedAt
      }
      investorInfo {
        id
        createdAt
        updatedAt
        investmentPreferences
        investmentHistory {
          id
          type
          investmentDate
          amount
          transactionId
        }
        portfolioSize
        riskTolerance
        preferredInvestmentDuration
      }
      kycInfo {
        kycStatus
      }
    }
  }
`;

export const IS_USER_REGISTERED = gql`
  query IsUserRegistered($publicKey: String!) {
    isUserRegistered(publicKey: $publicKey)
  }
`;