import { gql } from "@apollo/client";

// query($associatedId: String!) {
//     listings(query: { associatedId: $associatedId}) {
//         _id
//         assetDetails
//         associatedId
//         earningPotential
//         earningPotentialDuration
//         expectedNetReturn
//         images
//         marketValue
//         pastReturns
//     }
// }
// `;

export const ADD_LISTING = gql`
  mutation(
    $assetDetails: String!
    $associatedId: String!
    $earningPotential: String!
    $earningPotentialDuration: String!
    $expectedNetReturn: String!
    $images: [String!]!
    $marketValue: String!
    $pastReturns: String!
  ) {
    insertOneListing(
      data: {
        assetDetails: $assetDetails
        associatedId: $associatedId
        earningPotential: $earningPotential
        earningPotentialDuration: $earningPotentialDuration
        expectedNetReturn: $expectedNetReturn
        images: $images
        marketValue: $marketValue
        pastReturns: $pastReturns
      }
    ) {
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