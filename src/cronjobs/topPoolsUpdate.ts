/* eslint-disable prettier/prettier */
import { mainChains } from '@/lib/services/config/chain.config'
import { Logger } from '@/lib/services/logger'
import { testConnection } from '@/models/TopPool'
import { topPoolService } from '@/services/TopPoolService'
import { CronJob } from 'cron'

class TopPoolsUpdateCronJob {
  private readonly logger = new Logger('TopPoolsUpdateCronJob')
  private job: CronJob

  constructor() {
    // Cria um cronjob que executa a cada 30 minutos
    // Expressão cron: "*/30 * * * *" = minuto 0 e 30 de cada hora
    this.job = new CronJob('*/30 * * * *', this.execute.bind(this), null, false, 'UTC')
  }

  /**
   * Inicia o cronjob
   */
  start(): void {
    this.logger.info('Iniciando cronjob de atualização de top pools')
    this.job.start()
  }

  /**
   * Para o cronjob
   */
  stop(): void {
    this.logger.info('Parando cronjob de atualização de top pools')
    this.job.stop()
  }

  /**
   * Executa a tarefa de atualização das top pools
   */
  async execute(): Promise<void> {
    try {
      this.logger.info('Iniciando atualização periódica das top pools')

      // Testa a conexão com o banco antes de prosseguir
      this.logger.info('Testando conexão com o banco de dados...')
      const isConnected = await testConnection()
      if (!isConnected) {
        this.logger.error('Não foi possível conectar ao banco de dados. Abortando atualização.')
        return
      }
      this.logger.info('Conexão com o banco de dados OK')

      const startTime = Date.now()
      let totalPools = 0

      // Buscar todas as chains que têm suporte ao AMM
      const chains = mainChains().filter((chain) => 
        chain && 
        chain.sweepAndFlip && 
        chain.sweepAndFlip.amm && 
        chain.sweepAndFlip.amm.theGraph,
      )

      // Processar até 3 chains simultaneamente
      const batchSize = 3
      for (let i = 0; i < chains.length; i += batchSize) {
        const batch = chains.slice(i, i + batchSize)
        const promises = batch.map((chain) =>
          topPoolService
            .updateTopPoolsForChain(chain.chainId)
            .catch((error) => {
              this.logger.error(`Erro ao atualizar chain ${chain.chainId}: ${error}`)
              return 0
            }),
        )
        const results = await Promise.all(promises)
        totalPools += results.reduce((a, b) => a + b, 0)
      }

      const elapsedTime = (Date.now() - startTime) / 1000
      this.logger.info(
        `Atualização de top pools concluída em ${elapsedTime.toFixed(2)}s. Total: ${totalPools} pools`,
      )
    } catch (error) {
      this.logger.error(`Erro ao atualizar top pools: ${error}`)
    }
  }

  /**
   * Executa a atualização imediatamente (manualmente)
   */
  async executeNow(): Promise<void> {
    await this.execute()
  }
}

// Exporta uma instância do cronjob
export const topPoolsUpdateCronJob = new TopPoolsUpdateCronJob()
