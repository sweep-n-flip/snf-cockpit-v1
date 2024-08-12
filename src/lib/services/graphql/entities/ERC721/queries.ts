import { gql } from '@apollo/client/core'

export const GET_ERC721_TOKENS_BY_ADDRESS_QUERY = gql`
  query GetERC721TokensByAddress($chainId: Int!, $address: String!, $collectionAddress: String) {
    getERC721TokensByAddress(
      chainId: $chainId
      address: $address
      collectionAddress: $collectionAddress
    ) {
      tokenId
      name
      image
      collectionName
      collectionImageUrl
    }
  }
`

export const GET_ERC721_COLLECTIONS_BY_ADDRESS_QUERY = gql`
  query GetERC721CollectionsByAddress(
    $chainId: Int!
    $address: String!
    $collectionAddress: String
  ) {
    getERC721CollectionsByAddress(
      chainId: $chainId
      address: $address
      collectionAddress: $collectionAddress
    ) {
      address
      name
      image
      tokenCount
    }
  }
`

export const GET_ERC721_IS_APPROVED_FOR_ALL_QUERY = gql`
  query GetERC721IsApprovedForAll(
    $chainId: Int!
    $ownerAddress: String!
    $collectionAddress: String!
    $operatorAddress: String!
  ) {
    getERC721IsApprovedForAll(
      chainId: $chainId
      ownerAddress: $ownerAddress
      collectionAddress: $collectionAddress
      operatorAddress: $operatorAddress
    ) {
      isApprovedForAll
    }
  }
`
