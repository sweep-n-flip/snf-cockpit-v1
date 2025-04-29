import { corsHeaders, handleCorsRequest } from '@/lib/cors'
import { Logger } from '@/lib/services/logger'
import { topPoolService } from '@/services/TopPoolService'
import { BigNumber } from 'bignumber.js'
import { NextRequest, NextResponse } from 'next/server'

const logger = new Logger('TopPoolsAPI')

export async function OPTIONS() {
  logger.info('Recebida requisição OPTIONS')
  return handleCorsRequest()
}

export async function GET(request: NextRequest) {
  logger.info('Recebida requisição GET para /api/toppools')

  try {
    // Log dos headers recebidos
    const headers = Object.fromEntries(request.headers.entries())
    logger.info('Headers recebidos:', headers)

    // Verificar se há parâmetro chainId
    const url = new URL(request.url)
    const chainIdParam = url.searchParams.get('chainId')

    let responseData

    if (chainIdParam) {
      // Buscar pools por chainId
      const chainId = parseInt(chainIdParam, 10)

      if (isNaN(chainId)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Parâmetro inválido',
            message: 'O parâmetro chainId deve ser um número',
            timestamp: new Date().toISOString(),
          },
          { status: 400 },
        )
      }

      logger.info(`Buscando pools para chain ${chainId}`)
      const pools = await topPoolService.getTopPoolsFromDB(chainId)

      // Se não encontrar no banco, dispara atualização em background
      if (!pools || pools.length === 0) {
        logger.info(
          `Nenhuma pool encontrada no banco para chain ${chainId}, disparando atualização em background...`,
        )
        setTimeout(async () => {
          try {
            await topPoolService.updateTopPoolsForChain(chainId)
            logger.info(`Dados atualizados para chain ${chainId}`)
          } catch (error) {
            logger.error(`Erro ao atualizar dados em background: ${error}`)
          }
        }, 0)
      }

      responseData = {
        success: true,
        data: pools || [],
        timestamp: new Date().toISOString(),
      }
    } else {
      // Buscar todas as pools
      logger.info('Buscando todas as pools')
      const allPools = await topPoolService.getAllPools()

      // Ordenar pools por liquidez, APR, volume e preço
      const sortedPools = allPools.sort((a, b) => {
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

      responseData = {
        success: true,
        data: sortedPools,
        timestamp: new Date().toISOString(),
      }
    }

    // Criar resposta com headers CORS
    const response = NextResponse.json(responseData, { status: 200 })

    // Adicionar headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Log dos headers da resposta
    const responseHeaders = Object.fromEntries(response.headers.entries())
    logger.info('Headers da resposta:', responseHeaders)

    return response
  } catch (error) {
    logger.error('Erro ao processar requisição:', error)

    const errorResponse = NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )

    // Adicionar headers CORS mesmo em caso de erro
    Object.entries(corsHeaders).forEach(([key, value]) => {
      errorResponse.headers.set(key, value)
    })

    return errorResponse
  }
}
