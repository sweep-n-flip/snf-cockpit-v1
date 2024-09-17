'use client'

import {
  BalanceParams,
  BalanceResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'
import { useQuery } from '@apollo/client'
import { GET_ERC721_BALANCE_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'

type UseGetERC721BalanceProps = Partial<BalanceParams> & {
  skip?: boolean
}

export function useGetERC721Balance({
  chainId,
  ownerAddress,
  collectionAddress,
  skip,
}: UseGetERC721BalanceProps) {
  const { loading, data, refetch } = useQuery<{ getERC721Balance: BalanceResponse }, BalanceParams>(
    GET_ERC721_BALANCE_QUERY,
    {
      context: {
        chainId,
      },
      fetchPolicy: 'no-cache',
      skip: skip || !ownerAddress || !chainId || !collectionAddress,
      variables: {
        chainId: chainId!,
        ownerAddress: ownerAddress!,
        collectionAddress: collectionAddress!,
      },
    },
  )

  return {
    balance: data?.getERC721Balance || null,
    loading,
    refetch,
  }
}

export default useGetERC721Balance
