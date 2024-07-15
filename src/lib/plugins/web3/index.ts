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
        [`chains`],
        (acc, method) => ({
          ...acc,
          collections: collections[method]({ collections: acc.collections }),
        }),
        config,
      ),
    (config: Config) =>
      reduce<keyof typeof globals, Config>(
        [`project`],
        (acc, method) => ({
          ...acc,
          globals: globals[method]({ globals: config.globals }),
        }),
        config,
      ),
  )
}
