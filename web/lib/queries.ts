
import { gql } from "@apollo/client";

////////////////LISTING QUERIES////////////////////

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
            currency
            sold
            total
            mintAddress
        }
    }
`;

export const getListingByMintAddress = gql`
    query($mintAddress: String!) {
        listings(query: { mintAddress: $mintAddress }) {
            _id
            associatedId
            mintAddress
        }
    }
`;


////////////////USER QUERIES////////////////////

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
            onfidoWorkflowRunId
            onfidoKyc
            idvId
            idvStatus
        }
    }
`;

export const userProfileBasic = gql`
    query($wallet: String!) {
        users(query: { wallet: $wallet }) {
            profileImg
            userName
            onfidoKyc
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