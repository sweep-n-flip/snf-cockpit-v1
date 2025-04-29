import { chainConfig } from '@/lib/services/config/chain.config'
import { Logger } from '@/lib/services/logger'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import fetch from 'cross-fetch'

export class AmmGraphQlClient {
  private readonly logger = new Logger('AmmGraphQlClient')

  connect(chainId: number): ApolloClient<NormalizedCacheObject> | null {
    try {
      const config = chainConfig(chainId)
      if (!config || !config.sweepAndFlip || !config.sweepAndFlip.amm) {
        this.logger.error(`No sweep and flip config found for ${chainId}`)
        return null
      }

      const theGraph = config.sweepAndFlip.amm.theGraph
      if (!theGraph) {
        this.logger.error(`No theGraph endpoint found for AMM on chain ${chainId}`)
        return null
      }

      this.logger.info(`Connecting to subgraph for chain ${chainId}: ${theGraph}`)

      this.logger.info(
        `Chain config: ${JSON.stringify({
          name: config.name,
          chainId: config.chainId,
          useSubsquid: config.sweepAndFlip.amm.useSubsquid || false,
        })}`,
      )

      // Link para logs de queries
      const logLink = new ApolloLink((operation, forward) => {
        const { operationName, variables, query } = operation
        this.logger.info(`GraphQL Request to AMM for chain ${chainId}:`)
        this.logger.info(`Operation: ${operationName}`)
        this.logger.info(`Query: ${query.loc?.source.body}`)
        this.logger.info(`Variables: ${JSON.stringify(variables)}`)

        return forward(operation).map((result) => {
          this.logger.info(
            `GraphQL Response from AMM for chain ${chainId}: ${JSON.stringify(result.data)}`,
          )
          return result
        })
      })

      // Link para erros
      const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            this.logger.error(
              `GraphQL Error: Message: ${message}, Location: ${locations}, Path: ${path}`,
            )
          })
        }

        if (networkError) {
          this.logger.error(`Network Error: ${networkError}`)
        }
      })

      const httpLink = new HttpLink({ uri: theGraph, fetch })
      const cache = new InMemoryCache()

      const client = new ApolloClient({
        cache,
        link: ApolloLink.from([logLink, errorLink, httpLink]),
      })

      this.logger.info(`Apollo client created successfully for chain ${chainId}`)

      return client
    } catch (error) {
      this.logger.error(`Failed to connect to AMM GraphQL for chain ${chainId}`, error)
      return null
    }
  }
}

export const ammGraphQlClient = new AmmGraphQlClient()
