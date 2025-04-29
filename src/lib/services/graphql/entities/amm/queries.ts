import { gql } from '@apollo/client/core'

export const GET_TOP_POOLS_QUERY = gql`
  query GetTopPools($chainId: Int!) {
    topPools(chainId: $chainId) {
      id
      chainId
      name
      nftPrice
      nftListings
      offers
      apr
      totalVolume
      liquidity
      erc20Token {
        id
        name
        symbol
        isErc20
        isCollection
        wrapper {
          id
          name
          symbol
          isErc20
          isCollection
        }
      }
      collectionToken {
        id
        name
        isErc20
        isCollection
        wrapper {
          id
          name
          symbol
          isErc20
          isCollection
        }
      }
    }
  }
`

// Queries GraphQL do AMM (movidas do resolver)
export const COLLECTION_CURRENCIES_SUBSQUID_QUERY = gql`
  query GetCollectionCurrencies {
    currencies(where: { collection_isNull: false }) {
      name
      id
      symbol
      decimals
      wrapping
      collection {
        id
        name
        symbol
      }
    }
  }
`

export const COLLECTION_CURRENCIES_QUERY = gql`
  query GetCollectionCurrencies {
    pairs {
      id
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
        collection {
          id
          name
        }
      }
      discrete0
      discrete1
      reserve0
      reserve1
    }
  }
`

export const ERC20_NATIVE_PAIRS_SUBSQUID_QUERY = gql`
  query GetErc20NativePairs {
    pairs(limit: 1000) {
      id
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
      }
      discrete0
      discrete1
      reserve0
      reserve1
    }
  }
`

export const ERC20_NATIVE_PAIRS_QUERY = gql`
  query GetErc20NativePairs {
    pairs {
      id
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
      }
      discrete0
      discrete1
      reserve0
      reserve1
    }
  }
`

export const COLLECTION_NATIVE_PAIRS_SUBSQUID_QUERY = gql`
  query GetCollectionNativePairs {
    pairs(where: { discrete0_eq: true, discrete1_eq: false }, limit: 1000) {
      id
      discrete0
      discrete1
      token0 {
        id
        name
        symbol
        collection {
          id
          name
        }
      }
      token1 {
        id
        name
        symbol
        collection {
          id
          name
        }
      }
      reserve0
      reserve1
    }
  }
`

export const COLLECTION_NATIVE_PAIRS_QUERY = gql`
  query GetCollectionNativePairs {
    pairs {
      id
      token0 {
        id
        name
        symbol
      }
      token1 {
        id
        name
        symbol
        collection {
          id
          name
        }
      }
      discrete0
      discrete1
      reserve0
      reserve1
    }
  }
`

export const NATIVE_COLLECTION_PAIRS_SUBSQUID_QUERY = gql`
  query GetNativeCollectionPairs {
    pairs(where: { discrete0_eq: false, discrete1_eq: true }, limit: 1000) {
      id
      discrete0
      discrete1
      token0 {
        id
        name
        symbol
        collection {
          id
          name
        }
      }
      token1 {
        id
        name
        symbol
        collection {
          id
          name
        }
      }
      reserve0
      reserve1
    }
  }
`

export const NATIVE_COLLECTION_PAIRS_QUERY = gql`
  query GetNativeCollectionPairs {
    pairs {
      id
      token0 {
        id
        name
        symbol
        collection {
          id
          name
        }
      }
      token1 {
        id
        name
        symbol
      }
      discrete0
      discrete1
      reserve0
      reserve1
    }
  }
`

export const PAIR_DAILY_VOLUME_SUBSQUID_QUERY = gql`
  query GetPairDailyVolume($pair: String!) {
    pairDays(where: { pair: { id_eq: $pair } }, orderBy: day_DESC, limit: 7) {
      reserve0
      reserve1
      volume0
      volume1
    }
  }
`

export const PAIR_DAILY_VOLUME_QUERY = gql`
  query GetPairDailyVolume($pair: String!) {
    pairDays(where: { pair: $pair }, orderBy: day, orderDirection: desc, first: 7) {
      reserve0
      reserve1
      volume0
      volume1
    }
  }
`

export const PAIR_MONTHLY_TOTAL_VOLUME_SUBSQUID_QUERY = gql`
  query GetPairMonthlyVolume($pair: String!) {
    pairMonths(where: { pair: { id_eq: $pair } }) {
      volume0
      volume1
    }
  }
`

export const PAIR_MONTHLY_TOTAL_VOLUME_QUERY = gql`
  query GetPairMonthlyVolume($pair: String!) {
    pairMonths(where: { pair: $pair }) {
      volume0
      volume1
    }
  }
`
