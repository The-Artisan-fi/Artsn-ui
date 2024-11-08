import { gql } from '@apollo/client';

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
        type
    }
  }
`;

export const GET_ALL_LISTINGS = gql`
  query {
    getAllListings {
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