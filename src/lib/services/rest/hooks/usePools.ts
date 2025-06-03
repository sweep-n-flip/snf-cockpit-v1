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
    wrapper?: any
  }
  token1: {
    id: string
    symbol: string
    name: string
    isErc20: boolean
    isCollection: boolean
    address: string
    wrapper?: any
  }
  chain: {
    id: number
    name: string
    networkType: string
    rpcUrl: string
    explorerUrl: string
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
  chainId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
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

const createPool = async (poolData: Partial<Pool>): Promise<{ success: boolean; data: Pool }> => {
  const response = await fetch('/api/pools', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(poolData),
  })

  if (!response.ok) {
    throw new Error('Failed to create pool')
  }

  return response.json()
}

const updatePool = async ({
  id,
  data,
}: {
  id: string
  data: Partial<Pool>
}): Promise<{ success: boolean; data: Pool }> => {
  const response = await fetch(`/api/pools/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update pool')
  }

  return response.json()
}

const deletePool = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(`/api/pools/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete pool')
  }

  return response.json()
}

export const usePools = (params: PoolsParams = {}) => {
  return useQuery({
    queryKey: ['pools', params],
    queryFn: () => fetchPools(params),
  })
}

export const usePool = (id: string) => {
  return useQuery({
    queryKey: ['pool', id],
    queryFn: () => fetchPoolById(id),
    enabled: !!id,
  })
}

export const useCreatePool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] })
    },
  })
}

export const useUpdatePool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePool,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pools'] })
      queryClient.invalidateQueries({ queryKey: ['pool', variables.id] })
    },
  })
}

export const useDeletePool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] })
    },
  })
}
