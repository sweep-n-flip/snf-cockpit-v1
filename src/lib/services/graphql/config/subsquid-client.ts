/* eslint-disable prettier/prettier */
import { chainConfig } from '@/lib/services/config/chain.config'
import { Logger } from '@/lib/services/logger'
import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import fetch from 'cross-fetch'

const logger = new Logger('SubsquidClient')

export class SubsquidGraphQlClient {
  connect(chainId: number): ApolloClient<NormalizedCacheObject> | null {
    try {
      const config = chainConfig(chainId)
      if (!config || !config.sweepAndFlip || !config.sweepAndFlip.amm) {
        logger.error(`No sweep and flip config found for ${chainId}`)
        return null
      }

      // Usar o endpoint do theGraph como subsquid quando useSubsquid estiver ativado
      const subsquidEndpoint = config.sweepAndFlip.amm.theGraph
      if (!subsquidEndpoint) {
        logger.error(`No subsquid endpoint found for AMM on chain ${chainId}`)
        return null
      }

      // Verificar se useSubsquid está habilitado
      if (!config.sweepAndFlip.amm.useSubsquid) {
        logger.error(`Subsquid is not enabled for chain ${chainId}`)
        return null
      }

      logger.info(`Connecting to subsquid for chain ${chainId}: ${subsquidEndpoint}`)
      logger.info(
        `Chain config: ${JSON.stringify({
          name: config.name,
          chainId: config.chainId,
        })}`,
      )

      // Link para logs de queries
      const logLink = new ApolloLink((operation, forward) => {
        const { operationName, variables, query } = operation
        logger.info(`GraphQL Request to Subsquid for chain ${chainId}:`)
        logger.info(`Operation: ${operationName}`)
        logger.info(`Query: ${query.loc?.source.body}`)
        logger.info(`Variables: ${JSON.stringify(variables)}`)

        return forward(operation).map((result) => {
          logger.info(
            `GraphQL Response from Subsquid for chain ${chainId}: ${JSON.stringify(result.data)}`,
          )
          return result
        })
      })

      // Link para erros
      const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            logger.error(
              `GraphQL Error: Message: ${message}, Location: ${locations}, Path: ${path}`,
            )
          })
        }

        if (networkError) {
          logger.error(`Network Error: ${networkError}`)
        }
      })

      const httpLink = new HttpLink({ uri: subsquidEndpoint, fetch })
      const cache = new InMemoryCache()

      const client = new ApolloClient({
        cache,
        link: ApolloLink.from([logLink, errorLink, httpLink]),
      })

      logger.info(`Apollo client created successfully for chain ${chainId}`)

      return client
    } catch (error) {
      logger.error(`Failed to connect to Subsquid GraphQL for chain ${chainId}`, error)
      return null
    }
  }
}

export const subsquidGraphQlClient = new SubsquidGraphQlClient()
