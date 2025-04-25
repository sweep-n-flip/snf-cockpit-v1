import { chainConfig } from '@/lib/services/config/chain.config'
import { Logger } from '@/lib/services/logger'
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import fetch from 'cross-fetch'

export class SubsquidGraphQlClient {
  private readonly logger = new Logger('SubsquidGraphQlClient')

  connect(chainId: number): ApolloClient<NormalizedCacheObject> | null {
    try {
      const config = chainConfig(chainId)
      if (!config || !config.sweepAndFlip || !config.sweepAndFlip.amm) {
        this.logger.error(`No sweep and flip config found for ${chainId}`)
        return null
      }

      // Usar o endpoint do theGraph como subsquid quando useSubsquid estiver ativado
      const subsquidEndpoint = config.sweepAndFlip.amm.theGraph
      if (!subsquidEndpoint) {
        this.logger.error(`No subsquid endpoint found for AMM on chain ${chainId}`)
        return null
      }

      // Verificar se useSubsquid está habilitado
      if (!config.sweepAndFlip.amm.useSubsquid) {
        this.logger.error(`Subsquid is not enabled for chain ${chainId}`)
        return null
      }

      this.logger.info(`Connecting to subsquid for chain ${chainId}: ${subsquidEndpoint}`)
      this.logger.info(`Chain config: ${JSON.stringify({
        name: config.name,
        chainId: config.chainId
      })}`)

      // Link para logs de queries
      const logLink = new ApolloLink((operation, forward) => {
        const { operationName, variables, query } = operation
        this.logger.info(`GraphQL Request to Subsquid for chain ${chainId}:`)
        this.logger.info(`Operation: ${operationName}`)
        this.logger.info(`Query: ${query.loc?.source.body}`)
        this.logger.info(`Variables: ${JSON.stringify(variables)}`)
        
        return forward(operation).map((result) => {
          this.logger.info(`GraphQL Response from Subsquid for chain ${chainId}: ${JSON.stringify(result.data)}`)
          return result
        })
      })

      // Link para erros
      const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            this.logger.error(
              `[GraphQL Error] Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
            )
          })
        }
        if (networkError) {
          this.logger.error(`[Network Error] ${networkError}`)
        }
      })

      const httpLink = new HttpLink({ uri: subsquidEndpoint, fetch })
      const cache = new InMemoryCache()
      
      const client = new ApolloClient({
        cache,
        link: ApolloLink.from([logLink, errorLink, httpLink])
      })
      
      this.logger.info(`Apollo client created successfully for chain ${chainId}`)
      
      return client
    } catch (error) {
      this.logger.error(`Failed to connect to Subsquid GraphQL for chain ${chainId}`, error)
      return null
    }
  }
}

export const subsquidGraphQlClient = new SubsquidGraphQlClient() 