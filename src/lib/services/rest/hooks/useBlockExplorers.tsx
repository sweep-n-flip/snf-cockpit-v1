import { fetcherRest } from '@/lib/utils/fetcher'
import useSWR from 'swr'
import { BlockExplorers } from '@/lib/payloadcms/types/payload-types'
import { stringify } from 'qs'

interface UseBlockExplorersProps {
  chainId?: number
}

export const useBlockExplorers = ({ chainId }: UseBlockExplorersProps) => {
  const baseUrl = `${window.location.origin}/api/block_explorers`
  const query: Record<string, any> = {
    where: {},
  }

  if (chainId) {
    query.where['chain.chainId'] = {
      equals: chainId,
    }
  }

  const queryString = stringify(query, { addQueryPrefix: true })
  const url = queryString ? `${baseUrl}${queryString}` : baseUrl

  const { data, error, isLoading } = useSWR(url, fetcherRest<BlockExplorers>)

  return { blockExplorers: (data ?? []) as BlockExplorers[], error, isLoading }
}
