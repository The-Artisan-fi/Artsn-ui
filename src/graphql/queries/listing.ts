import { gql } from '@apollo/client'

export const GET_LISTING = gql`
  query ($associatedId: String!) {
    getListing(query: { associatedId: $associatedId }) {
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
`

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
`

// Get listings sorted by highest expected net return
export const GET_LISTINGS_BY_NET_RETURN = gql`
  query {
    getAllListings(sort: { expectedNetReturn: -1 }) {
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
`

// Get listings sorted by most recently created
export const GET_LISTINGS_BY_RECENT = gql`
  query {
    getAllListings(sort: { createdAt: -1 }) {
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
      createdAt
    }
  }
`

// Get listings sorted by most sold
export const GET_LISTINGS_BY_SALES = gql`
  query {
    getAllListings(sort: { sold: -1 }) {
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
`

// Optional: Get listings with limit and pagination
export const GET_LISTINGS_PAGINATED = gql`
  query ($sort: ListingSortInput!, $limit: Int, $offset: Int) {
    getAllListings(sort: $sort, limit: $limit, offset: $offset) {
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
`
