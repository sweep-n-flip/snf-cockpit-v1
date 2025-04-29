import { startAllCronJobs } from '@/cronjobs'
import { Logger } from '@/lib/services/logger'
import express from 'express'

const logger = new Logger('Server')

/**
 * Inicia os serviços do servidor
 * Esta função será chamada quando o servidor for iniciado
 */
export const initServer = async () => {
  const app = express()
  const port = process.env.PAYLOAD_PORT || 3000

  try {
    logger.info('Iniciando serviços do servidor...')

    // Iniciar cronjobs
    startAllCronJobs()

    app.listen(port, () => {
      logger.info(`Servidor rodando na porta ${port}`)
    })

    logger.info('Todos os serviços do servidor foram iniciados com sucesso')
  } catch (error) {
    logger.error(`Erro ao iniciar serviços do servidor: ${error}`)
  }
}
