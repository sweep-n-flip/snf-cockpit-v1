import { fetcherRest } from '@/lib/utils/fetcher'
import useSWR from 'swr'
import { Contracts } from '@/lib/payloadcms/types/payload-types'
import { stringify } from 'qs'

type ContractsType = Contracts['type']

interface UseContractsProps {
  chainId?: number
  type?: ContractsType
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

  const queryString = stringify(query, { addQueryPrefix: true })
  const url = queryString ? `${baseUrl}/${queryString}` : baseUrl

  const { data, error, isLoading } = useSWR(url, fetcherRest<Contracts>)

  return { contracts: data as Contracts[], error, isLoading }
}
