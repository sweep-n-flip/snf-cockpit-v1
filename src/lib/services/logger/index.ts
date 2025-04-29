/**
 * Serviço de Logger simples para a aplicação
 */
export class Logger {
  private prefix: string

  /**
   * Cria uma instância do logger
   * @param context Nome do contexto para o log (normalmente nome do serviço)
   */
  constructor(private context: string) {
    this.prefix = `[${context}]`
  }

  /**
   * Registra uma mensagem de informação
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais opcionais
   */
  info(message: string, data?: any): void {
    console.info(`${this.prefix} ${message}`, data || '')
  }

  /**
   * Registra uma mensagem de log genérica
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais opcionais
   */
  log(message: string, data?: any): void {
    console.log(`${this.prefix} ${message}`, data || '')
  }

  /**
   * Registra uma mensagem de aviso
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais opcionais
   */
  warn(message: string, data?: any): void {
    console.warn(`${this.prefix} ${message}`, data || '')
  }

  /**
   * Registra uma mensagem de erro
   * @param message Mensagem a ser registrada
   * @param error Erro ou dados adicionais opcionais
   */
  error(message: string, error?: any): void {
    console.error(`${this.prefix} ${message}`, error || '')
  }

  /**
   * Registra uma mensagem de debug (apenas em ambientes de desenvolvimento)
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais opcionais
   */
  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`${this.prefix} ${message}`, data || '')
    }
  }

  /**
   * Registra uma mensagem detalhada para depuração avançada
   * @param message Mensagem a ser registrada
   * @param data Dados adicionais opcionais
   */
  verbose(message: string, data?: any): void {
    if (process.env.DEBUG_VERBOSE === 'true') {
      console.log(`${this.prefix} VERBOSE: ${message}`, data || '')
    }
  }
}
