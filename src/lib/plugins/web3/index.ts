import type { Config } from 'payload'
import { collections } from './collections'
import { globals } from './globals'

import { flow, merge, reduce } from 'lodash'

export const plugin = () => {
  return flow(
    (incomingConfig: Config) => merge({}, incomingConfig), // Make a shallow copy of incomingConfig
    (config: Config) => {
      return reduce(
        [`chain`],
        (acc, method) => ({
          ...acc,
          collections: collections[method]({ collections: acc.collections }),
        }),
        config,
      )
    },
    (config: Config) =>
      reduce(
        [`settings`],
        (acc, method) => ({
          ...acc,
          globals: globals[method]({ globals: config.globals }),
        }),
        config,
      ),
  )
}
