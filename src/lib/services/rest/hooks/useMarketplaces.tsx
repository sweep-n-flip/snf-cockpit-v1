import { fetcherRest } from '@/lib/utils/fetcher'
import useSWR from 'swr'
import { Marketplaces } from '@/lib/payloadcms/types/payload-types'

interface UseMarketplacesProps {
  chainId?: number
}

export const useMarketplaces = ({ chainId }: UseMarketplacesProps) => {
  const uri = new URL('/api/marketplaces', window.location.origin)

  if (chainId) {
    uri.searchParams.set('chain.chain_id', chainId.toString())
  }

  const { data, error, isLoading } = useSWR(uri.toString(), fetcherRest<Marketplaces>)

  return { marketplaces: data as Marketplaces[], error, isLoading }
}
