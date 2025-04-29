import { gql } from '@apollo/client'

export const GET_COLLECTION_QUERY = gql`
  query GetCollection($chainId: Int!, $address: String!) {
    getCollection(chainId: $chainId, address: $address) {
      id
      address
      chainId
      name
      symbol
      description
      image
      banner
      tokenCount
      ownerCount
      floorPrice
      totalVolume
      lastUpdated
    }
  }
`

export const SEARCH_COLLECTIONS_QUERY = gql`
  query SearchCollections($chainId: Int!, $search: String, $limit: Int) {
    searchCollections(chainId: $chainId, search: $search, limit: $limit) {
      id
      address
      chainId
      name
      symbol
      description
      image
      banner
      tokenCount
      ownerCount
      floorPrice
      totalVolume
      lastUpdated
    }
  }
`
