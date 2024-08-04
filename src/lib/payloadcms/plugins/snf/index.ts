import type { Config } from 'payload'
import { collections } from './collections'
import { globals } from './globals'

import flow from 'lodash/flow'
import merge from 'lodash/merge'
import reduce from 'lodash/reduce'

export const plugin = () => {
  return flow(
    (incomingConfig: Config) => merge({}, incomingConfig), // Make a shallow copy of incomingConfig
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
  )
}
