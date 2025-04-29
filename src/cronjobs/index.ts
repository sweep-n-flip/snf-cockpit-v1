import { Logger } from '@/lib/services/logger'
import { topPoolsUpdateCronJob } from './topPoolsUpdate'

const logger = new Logger('CronJobs')

/**
 * Inicia todos os cronjobs da aplicação
 */
export async function startAllCronJobs(): Promise<void> {
  logger.info('Iniciando todos os cronjobs')

  // Inicia o cronjob de atualização de top pools
  topPoolsUpdateCronJob.start()

  // Executa imediatamente para termos dados desde o início
  logger.info('Executando cronjob de atualização inicial...')
  await topPoolsUpdateCronJob.executeNow()
  logger.info('Atualização inicial concluída')

  // Aqui podem ser adicionados outros cronjobs no futuro

  logger.info('Todos os cronjobs foram iniciados')
}

/**
 * Para todos os cronjobs da aplicação
 */
export function stopAllCronJobs(): void {
  logger.info('Parando todos os cronjobs')

  // Para o cronjob de atualização de top pools
  topPoolsUpdateCronJob.stop()

  // Aqui podem ser parados outros cronjobs no futuro

  logger.info('Todos os cronjobs foram parados')
}
