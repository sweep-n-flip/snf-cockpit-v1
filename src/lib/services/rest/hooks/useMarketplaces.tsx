import { fetcherRest } from '@/lib/utils/fetcher'
import useSWR from 'swr'
import { Marketplaces } from '@/lib/payloadcms/types/payload-types'
import { stringify } from 'qs'

interface UseMarketplacesProps {
  chainId?: number
}

export const useMarketplaces = ({ chainId }: UseMarketplacesProps) => {
  const baseUrl = `${window.location.origin}/api/marketplaces`
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

  const { data, error, isLoading } = useSWR(url, fetcherRest<Marketplaces>)

  return { marketplaces: (data ?? []) as Marketplaces[], error, isLoading }
}
