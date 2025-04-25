import { chainConfig } from '@/lib/services/config/chain.config'
import { ammGraphQlClient } from '@/lib/services/graphql/config/amm-client'
import {
  COLLECTION_CURRENCIES_QUERY,
  COLLECTION_CURRENCIES_SUBSQUID_QUERY,
  COLLECTION_NATIVE_PAIRS_QUERY,
  COLLECTION_NATIVE_PAIRS_SUBSQUID_QUERY,
  ERC20_NATIVE_PAIRS_QUERY,
  ERC20_NATIVE_PAIRS_SUBSQUID_QUERY,
  NATIVE_COLLECTION_PAIRS_QUERY,
  NATIVE_COLLECTION_PAIRS_SUBSQUID_QUERY,
  PAIR_DAILY_VOLUME_QUERY,
  PAIR_DAILY_VOLUME_SUBSQUID_QUERY,
  PAIR_MONTHLY_TOTAL_VOLUME_QUERY,
  PAIR_MONTHLY_TOTAL_VOLUME_SUBSQUID_QUERY
} from '@/lib/services/graphql/entities/amm/queries'
import {
  CollectionQueryResult,
  PairData,
  PairDayData,
  PairDayQueryResult,
  PairMonthData,
  PairMonthQueryResult,
  TopPoolResult
} from '@/lib/services/graphql/entities/amm/types'
import { Logger } from '@/lib/services/logger'
import { helpers } from '@/lib/services/utils/helpers'
import BigNumber from 'bignumber.js'
import { GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql'
import { TopPoolType } from './types'

// Adaptado do LiquidityPoolService do backend-v1
class AmmService {
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
          query: useSubsquid ? COLLECTION_CURRENCIES_SUBSQUID_QUERY : COLLECTION_CURRENCIES_QUERY
        })
        this.logger.info(`Resultado da consulta Collections: ${JSON.stringify(collectionsResult)}`)
        collections = collectionsResult.data
  
        // Consultando os pares de ERC20 e moedas nativas
        this.logger.info(`Iniciando consulta ao subgraph para ERC20 na chain ${chainId}`)
        const erc20Result = await client.query<CollectionQueryResult>({
          query: useSubsquid ? ERC20_NATIVE_PAIRS_SUBSQUID_QUERY : ERC20_NATIVE_PAIRS_QUERY
        })
        this.logger.info(`Resultado da consulta ERC20: ${JSON.stringify(erc20Result)}`)
        erc20 = erc20Result.data
  
        // Consultando os pares de coleções e moedas nativas (onde a coleção é o token1)
        this.logger.info(`Iniciando consulta ao subgraph para CollectionNative na chain ${chainId}`)
        const collectionNativeResult = await client.query<CollectionQueryResult>({
          query: useSubsquid ? COLLECTION_NATIVE_PAIRS_SUBSQUID_QUERY : COLLECTION_NATIVE_PAIRS_QUERY
        })
        this.logger.info(`Resultado da consulta CollectionNative: ${JSON.stringify(collectionNativeResult)}`)
        collectionNative = collectionNativeResult.data
  
        // Consultando os pares de moedas nativas e coleções (onde a coleção é o token0)
        this.logger.info(`Iniciando consulta ao subgraph para NativeCollection na chain ${chainId}`)
        const nativeCollectionResult = await client.query<CollectionQueryResult>({
          query: useSubsquid ? NATIVE_COLLECTION_PAIRS_SUBSQUID_QUERY : NATIVE_COLLECTION_PAIRS_QUERY
        })
        this.logger.info(`Resultado da consulta NativeCollection: ${JSON.stringify(nativeCollectionResult)}`)
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
      const filteredCollectionNative = collectionNative.pairs
        .filter((pair: PairData) => pair.token1?.collection?.id)
      
      const filteredNativeCollection = nativeCollection.pairs
        .filter((pair: PairData) => pair.token0?.collection?.id)
      
      // Combinando os pares de coleções-nativas de ambas as direções e removendo duplicatas
      const collectionPools = filteredCollectionNative.concat(filteredNativeCollection).reduce((unique: PairData[], o: PairData) => {
        if (
          !unique.some(
            (obj: PairData) =>
              (obj.token0.id === o.token0.id && obj.token1.id === o.token1.id) ||
              (obj.token1.id === o.token0.id && obj.token0.id === o.token1.id)
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

          const reserveCollection = new BigNumber(isToken1Collection ? collectionPool.reserve1 : collectionPool.reserve0)
          const reserveNativeCollection = new BigNumber(isToken1Collection ? collectionPool.reserve0 : collectionPool.reserve1)

          const MIN_LIQUIDITY = new BigNumber(chainId === 34443 ? 0.00001 : 0.001)
          // Ignorar pools com pouca liquidez
          if (reserveNativeCollection.lt(MIN_LIQUIDITY)) {
            return
          }

          // Buscar dados de volume diário
          const { data: collectionDailyData } = await client.query<PairDayQueryResult>({
            query: useSubsquid ? PAIR_DAILY_VOLUME_SUBSQUID_QUERY : PAIR_DAILY_VOLUME_QUERY,
            variables: {
              pair: collectionPool.id
            }
          })

          // Buscar dados de volume mensal
          const { data: collectionTotalVolumeData } = await client.query<PairMonthQueryResult>({
            query: useSubsquid ? PAIR_MONTHLY_TOTAL_VOLUME_SUBSQUID_QUERY : PAIR_MONTHLY_TOTAL_VOLUME_QUERY,
            variables: {
              pair: collectionPool.id
            }
          })

          let totalVolume = new BigNumber(0)
          let nativeDailyReserveCollection = new BigNumber(0)
          let nativeDailyVolumeCollection = new BigNumber(0)

          // Calculando volume total a partir dos dados mensais
          if (collectionTotalVolumeData?.pairMonths?.length > 0) {
            totalVolume = collectionTotalVolumeData.pairMonths
              .map((monthVolume: PairMonthData) => {
                return isToken1Collection ? new BigNumber(monthVolume.volume0) : new BigNumber(monthVolume.volume1)
              })
              .reduce((a: BigNumber, b: BigNumber) => a.plus(b), new BigNumber(0))
          }

          // Calculando métricas diárias
          if (collectionDailyData?.pairDays?.length > 0) {
            nativeDailyReserveCollection = collectionDailyData.pairDays
              .map((dayVolume: PairDayData) => {
                return isToken1Collection ? new BigNumber(dayVolume.reserve0) : new BigNumber(dayVolume.reserve1)
              })
              .reduce((a: BigNumber, b: BigNumber) => a.plus(b), new BigNumber(0))

            nativeDailyReserveCollection = nativeDailyReserveCollection.dividedBy(7)

            nativeDailyVolumeCollection = collectionDailyData.pairDays
              .map((dayVolume: PairDayData) => {
                return isToken1Collection ? new BigNumber(dayVolume.volume0) : new BigNumber(dayVolume.volume1)
              })
              .reduce((a: BigNumber, b: BigNumber) => a.plus(b), new BigNumber(0))

            nativeDailyVolumeCollection = nativeDailyVolumeCollection.dividedBy(7)
          }

          // Calculando APR com base nos dados diários
          const apr = this.calculateApr(nativeDailyReserveCollection.toString(), nativeDailyVolumeCollection.toString())

          if (!collectionToken.collection) {
            return
          }

          // Adicionando a pool processada ao array de resultados
          allPools.push({
            id: collectionPool.id,
            nftPrice: helpers.formatToLocaleString(reserveNativeCollection.dividedBy(reserveCollection), 5),
            nftListings: collectionPool.discrete0 ? collectionPool.reserve0 : collectionPool.reserve1,
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
                ? { wrapper: { ...nativeToken, symbol: nativeSymbol, isErc20: false, isCollection: false } }
                : {})
            },
            collectionToken: {
              ...collectionToken.collection,
              wrapper: { ...collectionToken, isCollection: false, isErc20: true },
              isCollection: true,
              isErc20: false
            }
          })
        })
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
        .filter(pool => pool.collectionToken.name !== null)

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
      chainId: { type: new GraphQLNonNull(GraphQLInt) }
    },
    resolve: async (_: any, args: { chainId: number }) => {
      const ammService = new AmmService()
      return await ammService.getTopPools(args.chainId)
    }
  }
} 