
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