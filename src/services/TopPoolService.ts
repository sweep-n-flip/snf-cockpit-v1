import { mainChains } from '@/lib/services/config/chain.config'
import { TopPoolResult } from '@/lib/services/graphql/entities/amm/types'
import { Logger } from '@/lib/services/logger'
import TopPool from '@/models/TopPool'

class TopPoolService {
  private readonly logger = new Logger('TopPoolService')
  private cache: Map<number, { data: TopPoolResult[]; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutos em milissegundos
  private readonly STALE_TTL = 30 * 60 * 1000 // 30 minutos em milissegundos
  private readonly updatingChains: Set<number> = new Set()

  /**
   * Atualiza as top pools no banco de dados para uma chain específica
   *
   * @param chainId - ID da blockchain a ser atualizada
   * @returns - Número de pools atualizadas
   */
  async updateTopPoolsForChain(chainId: number): Promise<number> {
    try {
      // Verifica se já está atualizando esta chain
      if (this.updatingChains.has(chainId)) {
        this.logger.info(`Chain ${chainId} já está sendo atualizada, ignorando...`)
        return 0
      }

      this.updatingChains.add(chainId)
      this.logger.info(`Iniciando atualização das top pools para a chain ${chainId}`)

      // Criar uma nova instância do AmmService
      const { AmmService } = await import(
        '@/lib/payloadcms/plugins/snf/graphql/entities/amm/resolvers'
      )
      const ammService = new AmmService()
      const pools = await ammService.getTopPools(chainId)

      if (!pools || pools.length === 0) {
        this.logger.warn(`Nenhuma pool encontrada para a chain ${chainId}`)
        return 0
      }

      this.logger.info(`Encontradas ${pools.length} pools para a chain ${chainId}`)

      // Usar bulkWrite para operações em lote (mais eficiente)
      const operations = pools.map((pool) => ({
        updateOne: {
          filter: { chainId, poolId: pool.id },
          update: {
            $set: {
              poolId: pool.id,
              chainId: pool.chainId,
              name: pool.name,
              nftPrice: parseFloat(pool.nftPrice.replace(',', '')),
              nftListings: pool.nftListings,
              offers: parseFloat(pool.offers.replace(',', '')),
              apr: parseFloat(pool.apr.replace(',', '')),
              totalVolume: parseFloat(pool.totalVolume.replace(',', '')),
              liquidity: parseFloat(pool.liquidity.replace(',', '')),
              erc20Token: pool.erc20Token,
              collectionToken: pool.collectionToken,
            },
          },
          upsert: true, // Criar se não existir
        },
      }))

      const result = await TopPool.bulkWrite(operations)

      // Atualiza o cache
      this.cache.set(chainId, {
        data: pools,
        timestamp: Date.now(),
      })

      this.logger.info(
        `Atualização para chain ${chainId} concluída: ${result.upsertedCount} inseridas, ${result.modifiedCount} modificadas`,
      )
      return pools.length
    } catch (error) {
      this.logger.error(`Erro ao atualizar top pools para chain ${chainId}: ${error}`)
      throw error
    } finally {
      this.updatingChains.delete(chainId)
    }
  }

  /**
   * Obtém as pools do cache, mesmo que estejam velhas
   *
   * @param chainId - ID da blockchain a consultar
   * @returns - Lista de top pools ou undefined se não houver cache
   */
  getCachedPools(chainId: number): TopPoolResult[] | undefined {
    const cached = this.cache.get(chainId)
    if (cached) {
      this.logger.info(`Retornando pools do cache (mesmo que velhas) para chain ${chainId}`)
      return cached.data
    }
    return undefined
  }

  /**
   * Obtém as top pools do banco de dados para uma chain específica
   *
   * @param chainId - ID da blockchain a consultar
   * @returns - Lista de top pools
   */
  async getTopPoolsFromDB(chainId: number): Promise<TopPoolResult[]> {
    try {
      this.logger.info(`Iniciando busca de pools para chain ${chainId}`)

      // Verifica se existe no cache e se ainda é válido
      const cached = this.cache.get(chainId)
      const now = Date.now()

      if (cached) {
        const age = now - cached.timestamp
        this.logger.info(`Cache encontrado para chain ${chainId}, idade: ${age / 1000}s`)

        // Se os dados são frescos (menos de 5 minutos), retorna do cache
        if (age < this.CACHE_TTL) {
          this.logger.info(`Retornando pools do cache para chain ${chainId} (${age / 1000}s)`)
          return cached.data
        }

        // Se os dados estão um pouco velhos (entre 5 e 30 minutos)
        // Retorna do cache mas dispara atualização em background
        if (age < this.STALE_TTL) {
          this.logger.info(
            `Retornando pools do cache (stale) para chain ${chainId} (${age / 1000}s)`,
          )

          // Dispara atualização em background se não estiver já atualizando
          if (!this.updatingChains.has(chainId)) {
            setTimeout(async () => {
              try {
                await this.updateTopPoolsForChain(chainId)
              } catch (error) {
                this.logger.error(`Erro ao atualizar pools em background: ${error}`)
              }
            }, 0)
          }

          return cached.data
        }
      }

      this.logger.info(`Buscando top pools do banco para chain ${chainId}`)

      // Otimizando a query:
      // 1. Usando projeção para retornar apenas os campos necessários
      // 2. Adicionando índice composto para melhorar a performance do sort
      // 3. Limitando a 100 resultados desde o início
      const pools = await TopPool.find(
        { chainId },
        {
          _id: 0,
          poolId: 1,
          chainId: 1,
          name: 1,
          nftPrice: 1,
          nftListings: 1,
          offers: 1,
          apr: 1,
          totalVolume: 1,
          liquidity: 1,
          erc20Token: 1,
          collectionToken: 1,
        },
      )
        .sort({
          liquidity: -1,
          apr: -1,
          totalVolume: -1,
        })
        .limit(100)
        .lean()

      this.logger.info(`Encontradas ${pools?.length || 0} pools no banco para chain ${chainId}`)

      if (!pools || pools.length === 0) {
        this.logger.warn(`Nenhuma pool encontrada no banco para chain ${chainId}`)
        // Se não encontrou no banco, tenta atualizar os dados
        await this.updateTopPoolsForChain(chainId)
        return []
      }

      // Mapear documentos do MongoDB para o formato esperado pela API
      const mappedPools: TopPoolResult[] = pools.map((pool) => ({
        id: pool.poolId,
        chainId: pool.chainId,
        name: pool.name,
        nftPrice: pool.nftPrice.toString(),
        nftListings: pool.nftListings,
        offers: pool.offers.toString(),
        apr: pool.apr.toString(),
        totalVolume: pool.totalVolume.toString(),
        liquidity: pool.liquidity.toString(),
        erc20Token: {
          ...pool.erc20Token,
          wrapper: pool.erc20Token.wrapper || {
            id: pool.erc20Token.id,
            name: pool.erc20Token.name,
            symbol: pool.erc20Token.symbol || '',
            isErc20: true,
            isCollection: false,
          },
        },
        collectionToken: {
          ...pool.collectionToken,
          wrapper: pool.collectionToken.wrapper || {
            id: pool.collectionToken.id,
            name: pool.collectionToken.name,
            symbol: pool.collectionToken.symbol || '',
            isErc20: false,
            isCollection: true,
          },
        },
      }))

      // Atualiza o cache
      this.cache.set(chainId, {
        data: mappedPools,
        timestamp: now,
      })

      return mappedPools
    } catch (error) {
      this.logger.error(`Erro ao buscar top pools do banco para chain ${chainId}: ${error}`)
      throw error
    }
  }

  /**
   * Obtém todas as pools de todas as chains
   * @returns Lista de todas as pools
   */
  async getAllPools(): Promise<TopPoolResult[]> {
    try {
      this.logger.info('Buscando todas as pools do banco')

      const pools = await TopPool.find(
        {},
        {
          _id: 0,
          poolId: 1,
          chainId: 1,
          name: 1,
          nftPrice: 1,
          nftListings: 1,
          offers: 1,
          apr: 1,
          totalVolume: 1,
          liquidity: 1,
          erc20Token: 1,
          collectionToken: 1,
        },
      )
        .sort({
          liquidity: -1,
          apr: -1,
          totalVolume: -1,
        })
        .lean()

      this.logger.info(`Encontradas ${pools?.length || 0} pools no total`)

      // Se não encontrou pools, dispara atualização em background para todas as chains
      if (!pools || pools.length === 0) {
        this.logger.warn('Nenhuma pool encontrada no banco, atualizando todas as chains...')
        this.updateAllChains()
        return []
      }

      // Mapear documentos do MongoDB para o formato esperado pela API
      const mappedPools: TopPoolResult[] = pools.map((pool) => ({
        id: pool.poolId,
        chainId: pool.chainId,
        name: pool.name,
        nftPrice: pool.nftPrice.toString(),
        nftListings: pool.nftListings,
        offers: pool.offers.toString(),
        apr: pool.apr.toString(),
        totalVolume: pool.totalVolume.toString(),
        liquidity: pool.liquidity.toString(),
        erc20Token: {
          ...pool.erc20Token,
          wrapper: pool.erc20Token.wrapper || {
            id: pool.erc20Token.id,
            name: pool.erc20Token.name,
            symbol: pool.erc20Token.symbol || '',
            isErc20: true,
            isCollection: false,
          },
        },
        collectionToken: {
          ...pool.collectionToken,
          wrapper: pool.collectionToken.wrapper || {
            id: pool.collectionToken.id,
            name: pool.collectionToken.name,
            symbol: pool.collectionToken.symbol || '',
            isErc20: false,
            isCollection: true,
          },
        },
      }))

      return mappedPools
    } catch (error) {
      this.logger.error(`Erro ao buscar todas as pools: ${error}`)
      throw error
    }
  }

  /**
   * Atualiza as pools de todas as chains suportadas
   * @private
   */
  private async updateAllChains(): Promise<void> {
    const chains = mainChains()
    this.logger.info(`Iniciando atualização de ${chains.length} chains`)

    // Processa até 3 chains simultaneamente para evitar sobrecarga
    const batchSize = 3
    for (let i = 0; i < chains.length; i += batchSize) {
      const batch = chains.slice(i, i + batchSize)
      const promises = batch.map((chain) =>
        this.updateTopPoolsForChain(chain.chainId).catch((error) => {
          this.logger.error(`Erro ao atualizar chain ${chain.chainId}: ${error}`)
          return 0
        }),
      )
      await Promise.all(promises)
    }

    this.logger.info('Atualização de todas as chains concluída')
  }
}

// Exporta uma instância do serviço
export const topPoolService = new TopPoolService()
