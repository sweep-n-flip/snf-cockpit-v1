import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Chain {
  id: string
  chainId: number
  name: string
  logo?: string
  isTestnet: boolean
  rpcAddress?: string
  explorerUrl?: string
  network?: any
  stablecoinAddress?: string
  trendingItems?: { item: string }[]
  fractionalizerV1?: any
  fractionalizer?: any
  crowdpad?: any
  buyFloor?: any
  marketplace?: any
  box?: any
  exchange?: any
  rockpool?: any
  openseaConfig?: any
  hub?: any
  topCollectionsFirebaseKey?: string
  reservoir?: any
  alchemyApiUrl?: string
  selectedCollections?: any
  sweepAndFlip?: any
  createdAt: string
  updatedAt: string
}

export interface ChainsResponse {
  success: boolean
  data: Chain[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalDocs: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ChainsParams {
  page?: number
  limit?: number
  isTestnet?: boolean
}

const fetchChains = async (params: ChainsParams = {}): Promise<ChainsResponse> => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(`/api/chains?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch chains')
  }

  return response.json()
}

const createChain = async (
  chainData: Partial<Chain>,
): Promise<{ success: boolean; data: Chain }> => {
  const response = await fetch('/api/chains', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chainData),
  })

  if (!response.ok) {
    throw new Error('Failed to create chain')
  }

  return response.json()
}

export const useChains = (params: ChainsParams = {}) => {
  return useQuery({
    queryKey: ['chains', params],
    queryFn: () => fetchChains(params),
  })
}

export const useCreateChain = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createChain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chains'] })
    },
  })
}
