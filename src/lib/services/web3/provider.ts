import { JsonRpcProvider } from 'ethers'
import { Logger } from '../logger'

// Logger para o serviço Web3
const logger = new Logger('Web3Service')

// Registro de provedores Web3 específicos para cada chain
const chainProviders: Record<string, JsonRpcProvider> = {}

/**
 * Inicializa um provedor Web3 para uma chain específica
 * 
 * @param chainId ID da blockchain
 * @param rpcUrl URL do endpoint RPC
 * @returns O provedor Web3 inicializado
 */
export function initWeb3Provider(
  chainId: string,
  rpcUrl: string
): JsonRpcProvider {
  // Verifica se já existe um provedor para esta chain
  if (chainProviders[chainId]) {
    logger.warn(`Provedor Web3 para chain ${chainId} já existe. Retornando provedor existente.`)
    return chainProviders[chainId]
  }

  // Cria um novo provedor
  const provider = new JsonRpcProvider(rpcUrl)
  
  // Armazena o provedor no registro
  chainProviders[chainId] = provider
  logger.info(`Provedor Web3 para chain ${chainId} inicializado com RPC: ${rpcUrl}`)

  return provider
}

/**
 * Obtém um provedor Web3 existente para uma chain específica
 * 
 * @param chainId ID da blockchain
 * @returns O provedor Web3 ou undefined se não existir
 */
export function getWeb3Provider(
  chainId: string
): JsonRpcProvider | undefined {
  if (!chainProviders[chainId]) {
    logger.warn(`Provedor Web3 para chain ${chainId} não encontrado`)
    return undefined
  }

  return chainProviders[chainId]
}

/**
 * Configura os provedores Web3 padrão para as chains suportadas
 */
export function setupDefaultWeb3Providers(): void {
  // Ethereum Mainnet
  initWeb3Provider(
    '1',
    'https://eth-mainnet.g.alchemy.com/v2/demo'
  )

  // Arbitrum
  initWeb3Provider(
    '42161',
    'https://arb-mainnet.g.alchemy.com/v2/demo'
  )

  // Base
  initWeb3Provider(
    '8453',
    'https://mainnet.base.org'
  )

  // Mode
  initWeb3Provider(
    '34443',
    'https://mainnet.mode.network'
  )

  logger.info('Provedores Web3 padrão configurados para Ethereum, Arbitrum, Base e Mode')
} 