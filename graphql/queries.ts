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
      coverImageUrl
      profilePictureUrl
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
      creatorInfo {
        detailedBio {
          profession
          education {
            schools {
              name
              degree
              fieldOfStudy
              graduationYear
            }
            relevantCourses
            specializedTraining
          }
          professionalAchievements {
            awards
            exhibitions
            portfolioLinks
          }
          collaborators
          employmentContracts {
            employer
            startDate
            endDate
            ipRightsInfo
          }
        }
        ipAssets
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
          terms
          transactionId
          creatorId
          ipId
        }
        portfolioSize
        riskTolerance
        preferredInvestmentDuration
      }
      kycInfo {
        kycStatus
        kycCompletionDate
        kycDocuments {
          documentType
          documentUrl
          verificationStatus
        }
      }
    }
  }
`;

export const GET_USER_DASHBOARD = gql`
  query GetUserDashboard {
    me {
      _id
      uuid
      username
      email
      firstName
      lastName
      profilePictureUrl
      role
      createdAt
      publicKey
      solanaTransactionId
      creatorInfo {
        detailedBio {
          profession
          education {
            schools {
              name
              degree
              fieldOfStudy
              graduationYear
            }
            relevantCourses
            specializedTraining
          }
          professionalAchievements {
            awards
            exhibitions
            portfolioLinks
          }
          collaborators
          employmentContracts {
            employer
            startDate
            endDate
            ipRightsInfo
          }
        }
        ipAssets
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
          terms
          transactionId
          creatorId
          ipId
        }
        portfolioSize
        riskTolerance
        preferredInvestmentDuration
      }
      kycInfo {
        kycStatus
        kycCompletionDate
        kycDocuments {
          documentType
          documentUrl
          verificationStatus
        }
      }
    }
  }
`;


// takes in an email address, checks if it's in system and returns true or false
// export const IS_USER_REGISTERED = gql`
//   query IsUserRegistered($email: String!) {
//     isUserRegistered(email: $email)
//   }
// `;

export const IS_USER_REGISTERED = gql`
  query IsUserRegistered($publicKey: String!) {
    isUserRegistered(publicKey: $publicKey)
  }
`;

export const CHECK_EMAIL = gql`
  mutation CheckEmail($publicKey: String!, $input: CheckEmailInput!) {
    checkEmail(publicKey: $publicKey, input: $input)
  }
`;

export const GET_LISTING = gql`
  query($associatedId: String!) {
    getListing(query: { associatedId: $associatedId}) {
        _id
        assetDetails
        associatedId
        earningPotential
        earningPotentialDuration
        expectedNetReturn
        images
        marketValue
        pastReturns
        currency
        model
        offerViews
        sold
        total
        mintAddress
        about
    }
  }
`;