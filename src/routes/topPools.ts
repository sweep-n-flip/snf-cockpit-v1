import { chainConfig } from '@/lib/services/config/chain.config'
import { Logger } from '@/lib/services/logger'
import { topPoolService } from '@/services/TopPoolService'
import { BigNumber } from 'bignumber.js'

const logger = new Logger('TopPoolsRoute')

export const getTopPools = async () => {
  try {
    logger.info('Requisição recebida para buscar top pools')
    const startTime = Date.now()

    // Buscar pools de todas as chains
    const allPools = await Promise.all(
      Object.keys(chainConfig).map(async (chainId) => {
        try {
          console.log('search top pools from db')
          return await topPoolService.getTopPoolsFromDB(Number(chainId))
        } catch (error) {
          logger.error(`Erro ao buscar pools da chain ${chainId}: ${error}`)
          return []
        }
      }),
    )

    // Juntar e ordenar todas as pools
    const pools = allPools.flat().sort((a, b) => {
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

    const elapsedTime = (Date.now() - startTime) / 1000
    logger.info(
      `Requisição processada em ${elapsedTime.toFixed(2)}s. Retornando ${pools?.length || 0} pools`,
    )

    return Response.json({
      success: true,
      data: pools || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error(`Erro ao buscar top pools: ${error}`)
    return Response.json(
      {
        success: false,
        error: 'Erro ao buscar top pools',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 },
    )
  }
}
