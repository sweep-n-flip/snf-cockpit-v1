'use client'

import { useQuery } from '@apollo/client'
import { GET_ERC721_COLLECTION_METADATA_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'

type CollectionMetadataParams = {
  chainId: number
  collectionAddress: string
}

type CollectionMetadataResponse = {
  name: string
  symbol: string
  description: string
  image: string
}

type UseGetERC721CollectionMetadataProps = Partial<CollectionMetadataParams> & {
  skip?: boolean
}

export function useGetERC721CollectionMetadata({
  chainId,
  collectionAddress,
  skip,
}: UseGetERC721CollectionMetadataProps) {
  const { loading, data, refetch } = useQuery<
    { getERC721CollectionMetadata: CollectionMetadataResponse },
    CollectionMetadataParams
  >(GET_ERC721_COLLECTION_METADATA_QUERY, {
    context: {
      chainId,
    },
    fetchPolicy: 'no-cache',
    skip: skip || !chainId || !collectionAddress,
    variables: {
      chainId: chainId!,
      collectionAddress: collectionAddress!,
    },
  })

  return {
    metadata: data?.getERC721CollectionMetadata || null,
    loading,
    refetch,
  }
}

export default useGetERC721CollectionMetadata
