import type { Config } from 'payload'

import { bridge } from './bridge'
import reduce from 'lodash/reduce'

export type EntitiesParams = {
  graphQL: Config['graphQL']
}

export const entities = ({ graphQL }: EntitiesParams): EntitiesParams['graphQL'] => {
  return {
    ...graphQL,
    /// @dev: Inject queries
    queries(...args) {
      return reduce(
        [graphQL?.queries, ...Object.values(bridge)],
        (acc, fn) => {
          return {
            ...acc,
            ...fn?.call(this, ...args),
          }
        },
        {},
      )
    },
  }
}
