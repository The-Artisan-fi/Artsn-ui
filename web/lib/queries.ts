
import { gql } from "@apollo/client";

export const listing = gql`
    query($associatedId: String!) {
        listings(query: { associatedId: $associatedId}) {
            _id
            assetDetails
            associatedId
            earningPotential
            earningPotentialDuration
            expectedNetReturn
            images
            marketValue
            pastReturns
        }
    }
    `;

export const allListings = gql`
    query {
        listings {
            _id
            assetDetails
            associatedId
            earningPotential
            earningPotentialDuration
            expectedNetReturn
            images
            marketValue
            pastReturns
        }
    }
`;

export const user = gql`
    query($wallet: String!) {
        users(query: { wallet: $wallet }) {
            _id
            fullName
            userName
            email
            wallet
            currencyPreference
            profileImg
        }
    }
`;

export const userProfileBasic = gql`
    query($wallet: String!) {
        users(query: { wallet: $wallet }) {
            profileImg
            userName
        }
    }
`;

export const userCurrencyPref = gql`
    query($wallet: String!) {
        users(query: { wallet: $wallet }) {
            currencyPreference
        }
    }
`;