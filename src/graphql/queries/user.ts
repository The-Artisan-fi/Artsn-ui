import { gql } from '@apollo/client'


export const IS_USER_REGISTERED = gql`
  query IsUserRegistered($publicKey: String!) {
    isUserRegistered(publicKey: $publicKey)
  }
`
