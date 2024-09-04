import { fetcherRest } from '@/lib/utils/fetcher'
import useSWR from 'swr'
import { Contracts } from '@/lib/payloadcms/types/payload-types'
import buildFindQueryString from '@/lib/ui/components/blocks/bridges/utils/constants/build-find-query-string'

interface UseContractsProps {
  chainId?: number
  type?: 'bridge'
}

export const useContracts = ({ chainId, type }: UseContractsProps) => {
  const baseUrl = `${window.location.origin}/api/contracts`
  const query: Record<string, any> = {}

  if (chainId) {
    query['chain.chainId'] = {
      equals: chainId,
    }
  }

  if (type) {
    query['type'] = {
      equals: type,
    }
  }

  const queryString = buildFindQueryString(query)
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl

  const { data, error, isLoading } = useSWR(url, fetcherRest<Contracts>)

  return { contracts: data as Contracts[], error, isLoading }
}
