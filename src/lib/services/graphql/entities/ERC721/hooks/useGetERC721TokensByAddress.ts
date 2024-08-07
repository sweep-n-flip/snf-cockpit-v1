'use client'

import { useQuery } from '@apollo/client'
import { GET_ERC721_TOKENS_BY_ADDRESS_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'
import { ERC721Tokens } from '@/lib/services/graphql/entities/ERC721/types'

type ERC721TokensByAddressQuery = {
  getERC721TokensByAddress?: ERC721Tokens
}

type UseGetERC721TokensByAddressProps = {
  chainId?: number
  address?: string
  collectionAddress?: string
  skip?: boolean
}

export function useGetERC721TokensByAddress({
  address,
  chainId,
  collectionAddress,
  skip,
}: UseGetERC721TokensByAddressProps) {
  const { loading, data, refetch } = useQuery<ERC721TokensByAddressQuery>(
    GET_ERC721_TOKENS_BY_ADDRESS_QUERY,
    {
      context: {
        chainId,
      },
      fetchPolicy: 'no-cache',
      skip: skip || !address || !chainId,
      variables: {
        collectionAddress,
        address,
        chainId,
      },
    },
  )

  return {
    tokens: data?.getERC721TokensByAddress || [],
    loading,
    refetch,
  }
}

export default useGetERC721TokensByAddress
