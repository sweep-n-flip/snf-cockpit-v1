'use client'

import { useQuery } from '@apollo/client'
import { GET_ERC721_IS_APPROVED_FOR_ALL_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'
import { ERC721IsApprovedForAll } from '@/lib/services/graphql/entities/ERC721/types'
import { Address } from 'viem'

type ERC721IsApprovedForAllQuery = {
  getERC721IsApprovedForAll?: ERC721IsApprovedForAll
}

type UseGetERC721IsApprovedForAllProps = {
  chainId?: number
  address?: Address
  operatorAddress?: Address
  collectionAddress?: Address
  skip?: boolean
}

export function useGetERC721IsApprovedForAll({
  address,
  chainId,
  collectionAddress,
  operatorAddress,
  skip,
}: UseGetERC721IsApprovedForAllProps) {
  const { loading, data, refetch } = useQuery<ERC721IsApprovedForAllQuery>(
    GET_ERC721_IS_APPROVED_FOR_ALL_QUERY,
    {
      context: {
        chainId,
      },
      fetchPolicy: 'no-cache',
      skip: skip || !address || !chainId || !collectionAddress || !operatorAddress,
      variables: {
        collectionAddress,
        operatorAddress,
        ownerAddress: address,
        chainId,
      },
    },
  )

  return {
    isApprovedForAll: data?.getERC721IsApprovedForAll?.isApprovedForAll || false,
    loading,
    refetch,
  }
}

export default useGetERC721IsApprovedForAll
