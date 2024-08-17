import { fetcherRest } from '@/lib/utils/fetcher'
import useSWR from 'swr'
import { Contracts } from '@/lib/payloadcms/types/payload-types'

interface UseContractsProps {
  chainId?: number
  type?: 'bridge'
}

export const useContracts = ({ chainId, type }: UseContractsProps) => {
  const uri = new URL('/api/contracts', window.location.origin)

  if (chainId) {
    uri.searchParams.set('chain.chain_id', chainId.toString())
  }

  if (type) {
    uri.searchParams.set('type', type)
  }

  const { data, error, isLoading } = useSWR(uri.toString(), fetcherRest<Contracts>)

  return { contracts: data as Contracts[], error, isLoading }
}
