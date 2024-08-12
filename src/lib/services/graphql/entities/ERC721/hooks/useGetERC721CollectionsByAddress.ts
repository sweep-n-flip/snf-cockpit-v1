'use client'

import {
  CollectionsParams,
  CollectionsResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'
import { queryName } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/collections'

import { useQuery } from '@apollo/client'
import { GET_ERC721_COLLECTIONS_BY_ADDRESS_QUERY } from '@/lib/services/graphql/entities/ERC721/queries'

type UseGetERC721CollectionsByAddressProps = Partial<CollectionsParams> & {
  skip?: boolean
}

export function useGetERC721CollectionsByAddress({
  address,
  chainId,
  collectionAddress,
  skip,
}: UseGetERC721CollectionsByAddressProps) {
  const { loading, data, refetch } = useQuery<
    { getERC721CollectionsByAddress: CollectionsResponse },
    CollectionsParams
  >(GET_ERC721_COLLECTIONS_BY_ADDRESS_QUERY, {
    context: {
      chainId,
    },
    fetchPolicy: 'cache-and-network',
    skip: skip || !address || !chainId,
    variables: {
      collectionAddress,
      address: address!,
      chainId: chainId!,
    },
  })

  return {
    collections: data?.[queryName] || [],
    loading,
    refetch,
  }
}

export default useGetERC721CollectionsByAddress
