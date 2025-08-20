import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface Pool {
  id: string
  poolId: string
  chainId: any
  name: string
  poolStats: {
    nftPrice: number
    nftListings: string | number
    offers: number
    apr: number
    totalVolume: number
    liquidity: number
    reserve0: number
    reserve1: number
    dailyVolume0: number
    dailyVolume1: number
    updatedAt: string
  }
  token0: {
    id: string
    symbol: string
    name: string
    isErc20: boolean
    isCollection: boolean
    address: string
    wrapper?: {
      address: string
      symbol: string
      name: string
    }
    collection?: {
      address: string
      symbol: string
      name: string
      totalSupply?: number
    }
  }
  token1: {
    id: string
    symbol: string
    name: string
    isErc20: boolean
    isCollection: boolean
    address: string
    wrapper?: {
      address: string
      symbol: string
      name: string
    }
    collection?: {
      address: string
      symbol: string
      name: string
      totalSupply?: number
    }
  }
  chain: {
    id: number
    chainId: number // AIDEV-NOTE: Added numeric chainId for easier matching
    name: string
    networkType: string
    rpcUrl: string
    explorerUrl: string
    nativeToken: {
      address: string
      symbol: string
      name: string
      decimals: number
    }
  }
  // AIDEV-NOTE: Helper fields for easier access
  erc20Token: {
    address: string
    symbol: string
    name: string
    decimals: number
  }
  nftToken: {
    address: string
    symbol: string
    name: string
    collectionAddress: string
    wrapperAddress: string
  }
  createdAt: string
  updatedAt: string
}

export interface PoolsResponse {
  success: boolean
  data: Pool[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalDocs: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface PoolsParams {
  page?: number
  limit?: number
  chainId?: string | number
  collectionAddress?: string
  erc20Address?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// AIDEV-NOTE: Enhanced pool lookup functions
export interface PoolByTokensParams {
  chainId: number
  fromTokenAddress?: string
  toTokenAddress?: string
  collectionAddress?: string
}

export interface PoolsByChainParams {
  chainId: number
  limit?: number
}

const fetchPools = async (params: PoolsParams = {}): Promise<PoolsResponse> => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, value.toString())
    }
  })

  const response = await fetch(`/api/pools?${searchParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch pools')
  }

  return response.json()
}

const fetchPoolById = async (id: string): Promise<{ success: boolean; data: Pool }> => {
  const response = await fetch(`/api/pools/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch pool')
  }

  return response.json()
}

export const usePools = (params?: PoolsParams) => {
  return useQuery({
    queryKey: ['pools', params],
    queryFn: () => fetchPools(params),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// AIDEV-NOTE: Hook to find pool by token pair - enhanced for multi-chain support
export const usePoolByTokens = (params: PoolByTokensParams) => {
  return useQuery({
    queryKey: ['pool-by-tokens', params],
    queryFn: async () => {
      console.log('[usePoolByTokens] Searching pool with params:', params)
      
      const searchParams: PoolsParams = {
        chainId: params.chainId.toString(),
        limit: 100, // Get enough pools to find the right one
      }
      
      if (params.collectionAddress) {
        searchParams.collectionAddress = params.collectionAddress
      }
      
      const response = await fetchPools(searchParams)
      
      // Filter pools to find the right one
      const pools = response.data || []
      console.log(`[usePoolByTokens] Found ${pools.length} pools on chain ${params.chainId}`)
      
      // Look for pool with matching collection
      const pool = pools.find((p: Pool) => {
        if (params.collectionAddress) {
          return p.nftToken?.collectionAddress?.toLowerCase() === params.collectionAddress.toLowerCase()
        }
        return false
      })
      return pool || null
    },
    enabled: !!params.chainId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  })
}

// AIDEV-NOTE: Hook to get pools by chain for native token detection
export const usePoolsByChain = (params: PoolsByChainParams) => {
  return useQuery({
    queryKey: ['pools-by-chain', params.chainId],
    queryFn: () => fetchPools({
      chainId: params.chainId,
      limit: params.limit || 50
    }),
    enabled: !!params.chainId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const usePool = (id: string) => {
  return useQuery({
    queryKey: ['pool', id],
    queryFn: () => fetchPoolById(id),
    enabled: !!id,
  })
}

