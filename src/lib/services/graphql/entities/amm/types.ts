// Tipos para objetos retornados das queries GraphQL
export interface TokenData {
  id: string
  name: string
  symbol: string
  collection?: {
    id: string
    name: string
  }
}

export interface PairData {
  id: string
  token0: TokenData
  token1: TokenData
  discrete0: boolean
  discrete1: boolean
  reserve0: string
  reserve1: string
}

export interface PairDayData {
  reserve0: string
  reserve1: string
  volume0: string
  volume1: string
}

export interface PairMonthData {
  volume0: string
  volume1: string
}

export interface GraphQLResponse<T> {
  data: T
}

export interface CollectionQueryResult {
  pairs: PairData[]
}

export interface PairDayQueryResult {
  pairDays: PairDayData[]
}

export interface PairMonthQueryResult {
  pairMonths: PairMonthData[]
}

export interface TopPoolResult {
  id: string
  nftPrice: string
  nftListings: string
  chainId: number
  name: string
  offers: string
  apr: string
  totalVolume: string
  liquidity: string
  erc20Token: {
    id: string
    name: string
    symbol: string
    isErc20: boolean
    isCollection: boolean
    wrapper?: {
      id: string
      name: string
      symbol: string
      isErc20: boolean
      isCollection: boolean
    }
  }
  collectionToken: {
    id: string
    name: string
    isErc20: boolean
    isCollection: boolean
    wrapper: {
      id: string
      name: string
      symbol: string
      isErc20: boolean
      isCollection: boolean
    }
  }
} 