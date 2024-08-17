import useSWR from 'swr'
import { fetcherRest } from '@/lib/utils/fetcher'
import { BlockExplorers } from '@/lib/payloadcms/types/payload-types'

interface UseBlockExplorersProps {
  chainId?: number
}

export const useBlockExplorers = ({ chainId }: UseBlockExplorersProps) => {
  const uri = new URL('/api/block_explorers', window.location.origin)

  if (chainId) {
    uri.searchParams.set('chain.chain_id', chainId.toString())
  }

  const { data, error, isLoading } = useSWR(uri.toString(), fetcherRest<BlockExplorers>)

  return { blockExplorers: (data ?? []) as BlockExplorers[], error, isLoading }
}
