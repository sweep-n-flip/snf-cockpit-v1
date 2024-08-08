'use client'

import {
  IsApprovedForAllParams,
  IsApprovedForAllResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'

import { useQuery } from '@apollo/client'
import { GET_ERC721_IS_APPROVED_FOR_ALL_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'
import { queryName } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/approval'

type UseGetERC721IsApprovedForAllProps = Partial<IsApprovedForAllParams> & {
  skip?: boolean
}

export function useGetERC721IsApprovedForAll({
  ownerAddress,
  chainId,
  collectionAddress,
  operatorAddress,
  skip,
}: UseGetERC721IsApprovedForAllProps) {
  const { loading, data, refetch } = useQuery<
    { [queryName: string]: IsApprovedForAllResponse },
    IsApprovedForAllParams
  >(GET_ERC721_IS_APPROVED_FOR_ALL_QUERY, {
    context: {
      chainId,
    },
    fetchPolicy: 'no-cache',
    skip: skip || !ownerAddress || !chainId || !collectionAddress || !operatorAddress,
    variables: {
      collectionAddress: collectionAddress!,
      operatorAddress: operatorAddress!,
      ownerAddress: ownerAddress!,
      chainId: chainId!,
    },
  })

  return {
    isApprovedForAll: data?.[queryName]?.isApprovedForAll || false,
    loading,
    refetch,
  }
}

export default useGetERC721IsApprovedForAll
