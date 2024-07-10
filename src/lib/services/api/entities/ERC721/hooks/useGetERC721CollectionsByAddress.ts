'use client'

import { useQuery } from '@apollo/client'
import { GET_ERC721_COLLECTIONS_BY_ADDRESS_QUERY } from '@/lib/services/api/entities/ERC721/queries'
import { ERC721Collections } from '@/lib/services/api/entities/ERC721/types'

type ERC721CollectionsByAddressQuery = {
  getERC721CollectionsByAddress?: ERC721Collections
}

type UseGetERC721CollectionsByAddressProps = {
  chainId?: number
  address?: string
  collectionAddress?: string
  skip?: boolean
}

export function useGetERC721CollectionsByAddress({
  address,
  chainId,
  collectionAddress,
  skip,
}: UseGetERC721CollectionsByAddressProps) {
  const { loading, data, refetch } = useQuery<ERC721CollectionsByAddressQuery>(
    GET_ERC721_COLLECTIONS_BY_ADDRESS_QUERY,
    {
      context: {
        chainId,
      },
      fetchPolicy: 'cache-and-network',
      skip: skip || !address || !chainId,
      variables: {
        collectionAddress,
        address,
        chainId,
      },
    },
  )

  return {
    collections: data?.getERC721CollectionsByAddress || [],
    loading,
    refetch,
  }
}

export default useGetERC721CollectionsByAddress
