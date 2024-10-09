import { gql } from '@apollo/client';

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
        profilePictureUrl
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
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      _id
      email
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        email
        username
      }
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword)
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email)
  }
`;

export const CREATE_IP = gql`
  mutation CreateIPAsset($input: IPAssetInput!) {
    createIPAsset(input: $input) {
      _id
      uuid
      creatorId
      name
      description
      videoLink
      fileLink
      blockchainId
      proofHash
      status
      type
      subtype
      rightsReserved
      publicInformation
      creativeProcess
      contentDeclaration
      aiReadiness
      commercialTerms
      collaborators
      tags
      createdAt
      updatedAt
      totalViews
      totalLikes
      totalShares
    }
  }
`;

export const ADD_CREATOR_PROFILE = gql`
mutation AddCreatorProfile(
  $uuid: String!
  $publicKey: String!
  $creatorInfo: CreatorInfoInput!
) {
  addCreatorProfile(
    uuid: $uuid
    publicKey: $publicKey
    creatorInfo: $creatorInfo
  ) {
    publicKey
    creatorInfo {
      detailedBio {
        profession
      }
    }
  }
}
`;