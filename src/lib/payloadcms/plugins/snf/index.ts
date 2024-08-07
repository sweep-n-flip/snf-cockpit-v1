import type { Config, PluginParams } from '@/lib/payloadcms/plugins/snf/types'
import { collections } from '@/lib/payloadcms/plugins/snf/collections'
import { globals } from '@/lib/payloadcms/plugins/snf/globals'
import { graphql } from '@/lib/payloadcms/plugins/snf/graphql'
import { config as graphQLConfig } from '@/lib/payloadcms/plugins/snf/graphql/config'
import flow from 'lodash/flow'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'

export const plugin = ({ graphQL }: PluginParams) => {
  return flow(
    /// @dev: Make a shallow copy of incomingConfig
    (incomingConfig: Config) => merge({}, incomingConfig),

    /// @dev: inject external GraphQL to config
    (config: Config): Config => graphQLConfig({ config, graphQL }),

    /// @dev: Inject collections
    (config: Config): Config =>
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
    (config: Config): Config =>
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
    (config: Config): Config =>
      reduce<keyof typeof graphql, Config>(
        [
          /// graphql custom entities resolvers
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
