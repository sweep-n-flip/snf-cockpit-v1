import { gql } from '@apollo/client/core'

export const GET_ERC721_APPROVAL_QUERY = gql`
  query GetERC721Approval(
    $chainId: Int!
    $collectionAddress: String!
    $ownerAddress: String!
    $operatorAddress: String!
  ) {
    getERC721Approval(
      chainId: $chainId
      collectionAddress: $collectionAddress
      ownerAddress: $ownerAddress
      operatorAddress: $operatorAddress
    ) {
      chainId
      collectionAddress
      ownerAddress
      operatorAddress
    }
  }
`

export const GET_ERC721_BALANCE_QUERY = gql`
  query GetERC721Balance($chainId: Int!, $ownerAddress: String!, $collectionAddress: String!) {
    getERC721Balance(
      chainId: $chainId
      ownerAddress: $ownerAddress
      collectionAddress: $collectionAddress
    ) {
      balance
    }
  }
`

export const GET_ERC721_COLLECTION_METADATA_QUERY = gql`
  query GetERC721CollectionMetadata($chainId: Int!, $collectionAddress: String!) {
    getERC721CollectionMetadata(chainId: $chainId, collectionAddress: $collectionAddress) {
      name
      symbol
      description
      image
    }
  }
`

export const GET_ERC721_OWNER_COLLECTIONS_QUERY = gql`
  query GetERC721Collections($address: String!, $chainId: Int!) {
    getERC721Collections(address: $address, chainId: $chainId) {
      collections {
        address
        image
        name
      }
    }
  }
`
