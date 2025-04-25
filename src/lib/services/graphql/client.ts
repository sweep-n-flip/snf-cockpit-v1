import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { Logger } from '../logger'

// Logger para o serviço GraphQL
const logger = new Logger('GraphQLService')

// Um registro para manter as instâncias de clientes GraphQL específicos para cada chain
const graphqlClients: Record<string, Record<string, ApolloClient<any>>> = {}

/**
 * Inicializa um novo cliente GraphQL para uma chain específica
 * 
 * @param chainId ID da blockchain
 * @param endpoint URL do endpoint GraphQL
 * @param clientName Nome opcional do cliente, útil quando temos múltiplos clientes para a mesma chain
 * @returns O cliente GraphQL inicializado
 */
export function initGraphQLClient(
  chainId: string, 
  endpoint: string, 
  clientName: string = 'default'
): ApolloClient<any> {
  // Verifica se já existe um cliente para esta chain
  if (!graphqlClients[chainId]) {
    graphqlClients[chainId] = {}
  }

  // Verifica se já existe um cliente com este nome para esta chain
  if (graphqlClients[chainId][clientName]) {
    logger.warn(`Cliente GraphQL para chain ${chainId} com nome '${clientName}' já existe. Retornando cliente existente.`)
    return graphqlClients[chainId][clientName]
  }

  // Cria um novo cliente Apollo
  const client = new ApolloClient({
    link: new HttpLink({ 
      uri: endpoint 
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  })

  // Armazena o novo cliente no registro
  graphqlClients[chainId][clientName] = client
  logger.info(`Cliente GraphQL para chain ${chainId} com nome '${clientName}' inicializado com endpoint: ${endpoint}`)

  return client
}

/**
 * Obtém um cliente GraphQL existente para uma chain específica
 * 
 * @param chainId ID da blockchain
 * @param clientName Nome do cliente, padrão é 'default'
 * @returns O cliente GraphQL ou undefined se não existir
 */
export function getGraphQLClient(
  chainId: string, 
  clientName: string = 'default'
): ApolloClient<any> | undefined {
  if (!graphqlClients[chainId] || !graphqlClients[chainId][clientName]) {
    logger.warn(`Cliente GraphQL para chain ${chainId} com nome '${clientName}' não encontrado`)
    return undefined
  }

  return graphqlClients[chainId][clientName]
}

/**
 * Configura os clientes GraphQL padrão para as chains suportadas
 */
export function setupDefaultGraphQLClients(): void {
  // Ethereum Mainnet
  initGraphQLClient(
    '1', 
    'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-ethereum', 
    'uniswap'
  )

  // Arbitrum
  initGraphQLClient(
    '42161', 
    'https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum', 
    'uniswap'
  )

  // Base
  initGraphQLClient(
    '8453', 
    'https://api.studio.thegraph.com/query/48211/uniswap-v3-base/version/latest', 
    'uniswap'
  )

  // Mode
  initGraphQLClient(
    '34443', 
    'https://gateway-arbitrum.network.thegraph.com/api/0c8b7cc0aa0f3f621e149da032d25c95/subgraphs/id/4WGgUQKE9Kq45iPxf8ATdh1QzKiHzGFrN1RQrHMKp9cz', 
    'uniswap'
  )

  logger.info('Clientes GraphQL padrão configurados para Ethereum, Arbitrum, Base e Mode')
} 