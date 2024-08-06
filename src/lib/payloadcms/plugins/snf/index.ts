import type { Config } from 'payload'
import { collections } from './collections'
import { globals } from './globals'
import { graphql } from './graphql'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import flow from 'lodash/flow'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'

export type PluginParams = {
  externalGraphQLClient: ApolloClient<NormalizedCacheObject>
}

export const plugin = ({ externalGraphQLClient }: PluginParams) => {
  return flow(
    /// @dev: Make a shallow copy of incomingConfig
    (incomingConfig: Config) => merge({}, incomingConfig),
    /// @dev: inject externalGraphQLClient to config
    (config: Config) => ({
      ...config,
      custom: {
        externalGraphQLClient,
      },
    }),
    /// @dev: Inject collections
    (config: Config) =>
      reduce<keyof typeof collections, Config>(
        [
          /// networks
          'chains',
          'rpcs',
          'marketplaces',
          'contracts',
          'blockExplorers',
          /// general
          'upload',
          'collections',
          'pages',
          'users',
          /// bridge
          'bridge_widgets',
          'bridge_categories',
        ],
        (acc, method) => ({
          ...acc,
          collections: collections[method]({ collections: acc.collections }),
        }),
        config,
      ),

    /// @dev: Inject globals
    (config: Config) =>
      reduce<keyof typeof globals, Config>(
        [
          /// project setup
          'project',
          /// providers setup
          'evm',
          'layer_zero',
          'cmc',
          'moralis',
          'opensea',
          'reservoir',
          'alchemy',
        ],
        (acc, method) => ({
          ...acc,
          globals: globals[method]({ globals: acc.globals }),
        }),
        config,
      ),
    /// @dev: Inject graphql
    (config: Config) =>
      reduce<keyof typeof graphql, Config>(
        [
          /// bridge
          'entities',
        ],
        (acc, method) => ({
          ...acc,
          graphQL: graphql[method]({ graphQL: acc.graphQL }),
        }),
        config,
      ),
  )
}
