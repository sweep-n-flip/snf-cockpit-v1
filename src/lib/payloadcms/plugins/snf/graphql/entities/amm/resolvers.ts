import { chainConfig } from '@/lib/services/config/chain.config'
import { ammGraphQlClient } from '@/lib/services/graphql/config/amm-client'
import { Logger } from '@/lib/services/logger'
import { helpers } from '@/lib/services/utils/helpers'
import { topPoolService } from '@/services/TopPoolService'
import { gql } from '@apollo/client'
import BigNumber from 'bignumber.js'
import { GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql'
import { TopPoolType } from './types'

// Queries GraphQL do AMM
const COLLECTION_CURRENCIES_SUBSQUID_QUERY = gql`
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

const COLLECTION_CURRENCIES_QUERY = gql`
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

const ERC20_NATIVE_PAIRS_SUBSQUID_QUERY = gql`
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

const ERC20_NATIVE_PAIRS_QUERY = gql`
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

const COLLECTION_NATIVE_PAIRS_SUBSQUID_QUERY = gql`
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

const COLLECTION_NATIVE_PAIRS_QUERY = gql`
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

const NATIVE_COLLECTION_PAIRS_SUBSQUID_QUERY = gql`
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

const NATIVE_COLLECTION_PAIRS_QUERY = gql`
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

const PAIR_DAILY_VOLUME_SUBSQUID_QUERY = gql`
  query GetPairDailyVolume($pair: String!) {
    pairDays(where: { pair: { id_eq: $pair } }, orderBy: day_DESC, limit: 7) {
      reserve0
      reserve1
      volume0
      volume1
    }
  }
`

const PAIR_DAILY_VOLUME_QUERY = gql`
  query GetPairDailyVolume($pair: String!) {
    pairDays(where: { pair: $pair }, orderBy: day, orderDirection: desc, first: 7) {
      reserve0
      reserve1
      volume0
      volume1
    }
  }
`

const PAIR_MONTHLY_TOTAL_VOLUME_SUBSQUID_QUERY = gql`
  query GetPairMonthlyVolume($pair: String!) {
    pairMonths(where: { pair: { id_eq: $pair } }) {
      volume0
      volume1
    }
  }
`

const PAIR_MONTHLY_TOTAL_VOLUME_QUERY = gql`
  query GetPairMonthlyVolume($pair: String!) {
    pairMonths(where: { pair: $pair }) {
      volume0
      volume1
    }
  }
`

// Tipos para objetos retornados das queries GraphQL
interface TokenData {
  id: string
  name: string
  symbol: string
  collection?: {
    id: string
    name: string
  }
}

interface PairData {
  id: string
  token0: TokenData
  token1: TokenData
  discrete0: boolean
  discrete1: boolean
  reserve0: string
  reserve1: string
}

interface PairDayData {
  reserve0: string
  reserve1: string
  volume0: string
  volume1: string
}

interface PairMonthData {
  volume0: string
  volume1: string
}

interface CollectionQueryResult {
  pairs: PairData[]
}

interface PairDayQueryResult {
  pairDays: PairDayData[]
}

interface PairMonthQueryResult {
  pairMonths: PairMonthData[]
}

interface TopPoolResult {
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

// Adicione a palavra-chave 'export' antes da definição da classe AmmService
export class AmmService {
  private readonly logger = new Logger('AmmService')

  private calculateApr(nativeReserve: string, nativeDailyMonthly: string): string {
    if (nativeReserve === '0' || nativeDailyMonthly === '0') {
      return '0'
    }

    const LIQUIDITY_PROVIDER_FEE = 0.01
    const dailyFee = new BigNumber(nativeDailyMonthly).times(LIQUIDITY_PROVIDER_FEE)
    const liquidity = new BigNumber(nativeReserve).times(2)
    const apr = dailyFee.dividedBy(liquidity).times(365).times(100).toString()

    return apr
  }

  async getTopPools(chainId: number): Promise<TopPoolResult[]> {
    try {
      const client = ammGraphQlClient.connect(chainId)
      if (!client) {
        this.logger.error(`No client configured for top pools on ${chainId}`)
        return []
      }

      const { network, sweepAndFlip } = chainConfig(chainId)
      if (!sweepAndFlip || !sweepAndFlip.amm) {
        this.logger.error(`SweepAndFlip configuration not found for chain ${chainId}`)
        return []
      }
      const { amm } = sweepAndFlip
      const { token } = network
      const { wrappedAddress, symbol: nativeSymbol } = token

      const useSubsquid = amm?.useSubsquid === true

      this.logger.info(`Using Subsquid: ${useSubsquid}`)

      let collections: CollectionQueryResult | undefined
      let erc20: CollectionQueryResult | undefined
      let collectionNative: CollectionQueryResult | undefined
      let nativeCollection: CollectionQueryResult | undefined

      try {
        // Consultando os pares de coleções e moedas
        this.logger.info(`Iniciando consulta ao subgraph para Collections na chain ${chainId}`)
        const collectionsResult = await client.query<CollectionQueryResult>({
          query: useSubsquid ? COLLECTION_CURRENCIES_SUBSQUID_QUERY : COLLECTION_CURRENCIES_QUERY,
        })
        this.logger.info(`Resultado da consulta Collections: ${JSON.stringify(collectionsResult)}`)
        collections = collectionsResult.data

        // Consultando os pares de ERC20 e moedas nativas
        this.logger.info(`Iniciando consulta ao subgraph para ERC20 na chain ${chainId}`)
        const erc20Result = await client.query<CollectionQueryResult>({
          query: useSubsquid ? ERC20_NATIVE_PAIRS_SUBSQUID_QUERY : ERC20_NATIVE_PAIRS_QUERY,
        })
        this.logger.info(`Resultado da consulta ERC20: ${JSON.stringify(erc20Result)}`)
        erc20 = erc20Result.data

        // Consultando os pares de coleções e moedas nativas (onde a coleção é o token1)
        this.logger.info(`Iniciando consulta ao subgraph para CollectionNative na chain ${chainId}`)
        const collectionNativeResult = await client.query<CollectionQueryResult>({
          query: useSubsquid
            ? COLLECTION_NATIVE_PAIRS_SUBSQUID_QUERY
            : COLLECTION_NATIVE_PAIRS_QUERY,
        })
        this.logger.info(
          `Resultado da consulta CollectionNative: ${JSON.stringify(collectionNativeResult)}`,
        )
        collectionNative = collectionNativeResult.data

        // Consultando os pares de moedas nativas e coleções (onde a coleção é o token0)
        this.logger.info(`Iniciando consulta ao subgraph para NativeCollection na chain ${chainId}`)
        const nativeCollectionResult = await client.query<CollectionQueryResult>({
          query: useSubsquid
            ? NATIVE_COLLECTION_PAIRS_SUBSQUID_QUERY
            : NATIVE_COLLECTION_PAIRS_QUERY,
        })
        this.logger.info(
          `Resultado da consulta NativeCollection: ${JSON.stringify(nativeCollectionResult)}`,
        )
        nativeCollection = nativeCollectionResult.data

        if (!collections || !erc20 || !collectionNative || !nativeCollection) {
          this.logger.error(`No top pool data found for ${chainId}`)
          return []
        }

        // Log para depuração
        this.logger.info(`Collections pairs found: ${collections.pairs?.length || 0}`)
        this.logger.info(`ERC20 pairs found: ${erc20.pairs?.length || 0}`)
        this.logger.info(`Collection-Native pairs found: ${collectionNative.pairs?.length || 0}`)
        this.logger.info(`Native-Collection pairs found: ${nativeCollection.pairs?.length || 0}`)
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        this.logger.error(`Error querying subgraph for chain ${chainId}: ${errorMessage}`)
        this.logger.error(`Detalhes completos do erro: ${JSON.stringify(error)}`)
        return []
      }

      // Inicializando array de pools
      const allPools: TopPoolResult[] = []

      // Filtrando manualmente os pares com coleções, já que removemos os filtros das queries
      const filteredCollectionNative = collectionNative.pairs.filter(
        (pair: PairData) => pair.token1?.collection?.id,
      )

      const filteredNativeCollection = nativeCollection.pairs.filter(
        (pair: PairData) => pair.token0?.collection?.id,
      )

      // Combinando os pares de coleções-nativas de ambas as direções e removendo duplicatas
      const collectionPools = filteredCollectionNative
        .concat(filteredNativeCollection)
        .reduce((unique: PairData[], o: PairData) => {
          if (
            !unique.some(
              (obj: PairData) =>
                (obj.token0.id === o.token0.id && obj.token1.id === o.token1.id) ||
                (obj.token1.id === o.token0.id && obj.token0.id === o.token1.id),
            )
          ) {
            unique.push(o)
          }
          return unique
        }, [])

      this.logger.debug(`Found ${collectionPools.length} collection-native pairs on ${chainId}`)
      this.logger.debug(`Found ${erc20.pairs.length} erc20-native pairs on ${chainId}`)

      // Processando cada pool de coleção-nativa para construir os dados para a resposta
      await Promise.all(
        collectionPools.map(async (collectionPool: PairData) => {
          const isToken1Collection = collectionPool.discrete1 === true
          const collectionToken = isToken1Collection ? collectionPool.token1 : collectionPool.token0
          const nativeToken = isToken1Collection ? collectionPool.token0 : collectionPool.token1

          const reserveCollection = new BigNumber(
            isToken1Collection ? collectionPool.reserve1 : collectionPool.reserve0,
          )
          const reserveNativeCollection = new BigNumber(
            isToken1Collection ? collectionPool.reserve0 : collectionPool.reserve1,
          )

          const MIN_LIQUIDITY = new BigNumber(chainId === 34443 ? 0.00001 : 0.001)
          // Ignorar pools com pouca liquidez
          if (reserveNativeCollection.lt(MIN_LIQUIDITY)) {
            return
          }

          // Buscar dados de volume diário
          const { data: collectionDailyData } = await client.query<PairDayQueryResult>({
            query: useSubsquid ? PAIR_DAILY_VOLUME_SUBSQUID_QUERY : PAIR_DAILY_VOLUME_QUERY,
            variables: {
              pair: collectionPool.id,
            },
          })

          // Buscar dados de volume mensal
          const { data: collectionTotalVolumeData } = await client.query<PairMonthQueryResult>({
            query: useSubsquid
              ? PAIR_MONTHLY_TOTAL_VOLUME_SUBSQUID_QUERY
              : PAIR_MONTHLY_TOTAL_VOLUME_QUERY,
            variables: {
              pair: collectionPool.id,
            },
          })

          let totalVolume = new BigNumber(0)
          let nativeDailyReserveCollection = new BigNumber(0)
          let nativeDailyVolumeCollection = new BigNumber(0)

          // Calculando volume total a partir dos dados mensais
          if (collectionTotalVolumeData?.pairMonths?.length > 0) {
            totalVolume = collectionTotalVolumeData.pairMonths
              .map((monthVolume: PairMonthData) => {
                return isToken1Collection
                  ? new BigNumber(monthVolume.volume0)
                  : new BigNumber(monthVolume.volume1)
              })
              .reduce((a: BigNumber, b: BigNumber) => a.plus(b), new BigNumber(0))
          }

          // Calculando métricas diárias
          if (collectionDailyData?.pairDays?.length > 0) {
            nativeDailyReserveCollection = collectionDailyData.pairDays
              .map((dayVolume: PairDayData) => {
                return isToken1Collection
                  ? new BigNumber(dayVolume.reserve0)
                  : new BigNumber(dayVolume.reserve1)
              })
              .reduce((a: BigNumber, b: BigNumber) => a.plus(b), new BigNumber(0))

            nativeDailyReserveCollection = nativeDailyReserveCollection.dividedBy(7)

            nativeDailyVolumeCollection = collectionDailyData.pairDays
              .map((dayVolume: PairDayData) => {
                return isToken1Collection
                  ? new BigNumber(dayVolume.volume0)
                  : new BigNumber(dayVolume.volume1)
              })
              .reduce((a: BigNumber, b: BigNumber) => a.plus(b), new BigNumber(0))

            nativeDailyVolumeCollection = nativeDailyVolumeCollection.dividedBy(7)
          }

          // Calculando APR com base nos dados diários
          const apr = this.calculateApr(
            nativeDailyReserveCollection.toString(),
            nativeDailyVolumeCollection.toString(),
          )

          if (!collectionToken.collection) {
            return
          }

          // Adicionando a pool processada ao array de resultados
          allPools.push({
            id: collectionPool.id,
            nftPrice: helpers.formatToLocaleString(
              reserveNativeCollection.dividedBy(reserveCollection),
              5,
            ),
            nftListings: collectionPool.discrete0
              ? collectionPool.reserve0
              : collectionPool.reserve1,
            chainId,
            name: `${nativeToken.name}/${collectionToken.collection.name}`,
            offers: helpers.formatToLocaleString(reserveNativeCollection, 5),
            apr,
            totalVolume: helpers.formatToLocaleString(totalVolume, 5),
            liquidity: helpers.formatToLocaleString(reserveNativeCollection.multipliedBy(2), 5),
            erc20Token: {
              ...nativeToken,
              id: nativeToken.id === wrappedAddress.toLowerCase() ? nativeSymbol : nativeToken.id,
              isErc20: true,
              isCollection: false,
              ...(nativeToken.id === wrappedAddress.toLowerCase()
                ? {
                    wrapper: {
                      ...nativeToken,
                      symbol: nativeSymbol,
                      isErc20: false,
                      isCollection: false,
                    },
                  }
                : {}),
            },
            collectionToken: {
              ...collectionToken.collection,
              wrapper: { ...collectionToken, isCollection: false, isErc20: true },
              isCollection: true,
              isErc20: false,
            },
          })
        }),
      )

      // Ordenando e filtrando pools por APR, volume e preço
      const filteredPools = allPools
        .sort((a, b) => {
          const liquidityA = new BigNumber(a.liquidity.replace(',', ''))
          const liquidityB = new BigNumber(b.liquidity.replace(',', ''))

          const apyA = new BigNumber(a.apr)
          const apyB = new BigNumber(b.apr)

          const volumeA = new BigNumber(a.totalVolume)
          const volumeB = new BigNumber(b.totalVolume)

          const priceA = new BigNumber(a.nftPrice)
          const priceB = new BigNumber(b.nftPrice)

          const isLiquidityAEqual = liquidityA.isEqualTo(liquidityB)
          const isApyAEqual = apyA.isEqualTo(apyB)
          const isVolumeAEqual = volumeA.isEqualTo(volumeB)
          const isPriceAEqual = priceA.isEqualTo(priceB)

          if (!isLiquidityAEqual) {
            return liquidityB.minus(liquidityA).toNumber()
          }

          if (!isApyAEqual) {
            return apyB.minus(apyA).toNumber()
          }

          if (!isVolumeAEqual) {
            return volumeB.minus(volumeA).toNumber()
          }

          if (!isPriceAEqual) {
            return priceB.minus(priceA).toNumber()
          }

          return 0
        })
        .filter((pool) => pool.collectionToken.name !== null)

      this.logger.info(`Found ${allPools.length} pools on ${chainId}`)
      return filteredPools
    } catch (e) {
      this.logger.error(`Failed to get top pools on ${chainId}`)
      this.logger.error(`${e}`)
      return []
    }
  }
}

export const ammResolvers = {
  topPools: {
    type: new GraphQLList(TopPoolType),
    args: {
      chainId: { type: new GraphQLNonNull(GraphQLInt) },
    },
    resolve: async (_: any, args: { chainId: number }) => {
      try {
        const logger = new Logger('TopPoolsResolver')
        const { chainId } = args

        // Registra o timestamp inicial para medir o desempenho
        const startTime = Date.now()
        logger.info(`Requisição recebida para top pools da chain ${chainId}`)

        // Buscar do banco de dados (que agora usa cache)
        logger.info(`Buscando pools do banco de dados para chain ${chainId}`)
        const dbStartTime = Date.now()

        try {
          // Usar Promise.race para adicionar um timeout
          const pools = (await Promise.race([
            topPoolService.getTopPoolsFromDB(chainId),
            new Promise<TopPoolResult[]>(
              (_, reject) => setTimeout(() => reject(new Error('Timeout ao buscar pools')), 60000), // 1 minuto
            ),
          ])) as TopPoolResult[]

          const dbElapsedTime = (Date.now() - dbStartTime) / 1000
          logger.info(
            `Busca no banco concluída em ${dbElapsedTime.toFixed(2)}s para chain ${chainId}`,
          )

          // Disparar atualização em background apenas se não houver dados no cache
          if (!pools || pools.length === 0) {
            setTimeout(async () => {
              try {
                logger.info(`Iniciando atualização em background para chain ${chainId}`)
                const updateStartTime = Date.now()
                await topPoolService.updateTopPoolsForChain(chainId)
                const updateElapsedTime = (Date.now() - updateStartTime) / 1000
                logger.info(
                  `Pools da chain ${chainId} atualizadas em background em ${updateElapsedTime.toFixed(2)}s`,
                )
              } catch (error) {
                logger.error(`Erro ao atualizar pools em background: ${error}`)
              }
            }, 0)
          }

          const totalElapsedTime = (Date.now() - startTime) / 1000
          logger.info(
            `Requisição processada em ${totalElapsedTime.toFixed(2)}s. Retornando ${pools?.length || 0} pools do banco`,
          )

          return pools || []
        } catch (error) {
          // Se der timeout ou outro erro, tenta retornar do cache mesmo que esteja velho
          const cached = topPoolService.getCachedPools(chainId)
          if (cached) {
            logger.warn(`Erro na busca do banco, retornando dados do cache para chain ${chainId}`)
            return cached
          }
          throw error
        }
      } catch (error) {
        const logger = new Logger('TopPoolsResolver')
        logger.error(`Erro ao buscar top pools: ${error}`)
        return []
      }
    },
  },
}
