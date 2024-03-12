
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
            basicInfo
            currency
            description
            model
            offerViews
            sold
            total
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
            basicInfo
            currency
            description
            model
            offerViews
            sold
            total
        }
    }
`;