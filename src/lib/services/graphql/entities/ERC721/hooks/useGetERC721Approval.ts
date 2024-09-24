'use client'

import {
  ApprovalParams,
  ApprovalResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'
import { useQuery } from '@apollo/client'
import { GET_ERC721_APPROVAL_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'

type UseGetERC721ApprovalProps = Partial<ApprovalParams> & {
  skip?: boolean
}

export function useGetERC721Approval({
  chainId,
  ownerAddress,
  collectionAddress,
  operatorAddress,
  skip,
}: UseGetERC721ApprovalProps) {
  const { loading, data, refetch } = useQuery<
    { getERC721Approval: ApprovalResponse },
    ApprovalParams
  >(GET_ERC721_APPROVAL_QUERY, {
    context: {
      chainId,
    },
    fetchPolicy: 'no-cache',
    skip: skip || !ownerAddress || !chainId || !collectionAddress || !operatorAddress,
    variables: {
      chainId: chainId!,
      ownerAddress: ownerAddress!,
      collectionAddress: collectionAddress!,
      operatorAddress: operatorAddress!,
    },
  })

  return {
    approval: data?.getERC721Approval || null,
    loading,
    refetch,
  }
}

export default useGetERC721Approval
