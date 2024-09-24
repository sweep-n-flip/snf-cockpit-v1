'use client'

import { useQuery } from '@apollo/client'
import { GET_ERC721_OWNER_COLLECTIONS_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'

type OwnerCollectionsParams = {
  chainId: number
  address: string
}

type OwnerCollectionsResponse = {
  collections: {
    address: string
    name: string
    image?: string
    tokenCount: string
  }[]
}

type UseGetERC721OwnerCollectionsProps = Partial<OwnerCollectionsParams> & {
  skip?: boolean
}

export function useGetERC721OwnerCollections({
  chainId,
  address,
  skip,
}: UseGetERC721OwnerCollectionsProps) {
  const { loading, data, refetch } = useQuery<
    { getERC721Collections: OwnerCollectionsResponse },
    OwnerCollectionsParams
  >(GET_ERC721_OWNER_COLLECTIONS_QUERY, {
    context: {
      chainId,
    },
    fetchPolicy: 'no-cache',
    skip: skip || !chainId || !address,
    variables: {
      chainId: chainId!,
      address: address!,
    },
  })

  return {
    collections: data?.getERC721Collections?.collections || [],
    loading,
    refetch,
  }
}

export default useGetERC721OwnerCollections
