'use client'

import {
  TokensParams,
  TokensResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'
import { queryName } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/tokens'

import { useQuery } from '@apollo/client'
import { GET_ERC721_TOKENS_BY_ADDRESS_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'

type UseGetERC721TokensByAddressProps = Partial<TokensParams> & {
  skip?: boolean
}

export function useGetERC721TokensByAddress({
  address,
  chainId,
  collectionAddress,
  skip,
}: UseGetERC721TokensByAddressProps) {
  const { loading, data, refetch } = useQuery<
    { getERC721TokensByAddress: TokensResponse },
    TokensParams
  >(GET_ERC721_TOKENS_BY_ADDRESS_QUERY, {
    context: {
      chainId,
    },
    fetchPolicy: 'no-cache',
    skip: skip || !address || !chainId,
    variables: {
      collectionAddress,
      address: address!,
      chainId: chainId!,
    },
  })

  return {
    tokens: data?.[queryName] || [],
    loading,
    refetch,
  }
}

export default useGetERC721TokensByAddress
