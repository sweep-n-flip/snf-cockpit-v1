import type { Config } from 'payload'

import { bridge } from './bridge'
import { reduce } from 'lodash'

export type EntitiesParams = {
  graphQL: Config['graphQL']
}

export const entities = ({ graphQL }: EntitiesParams): EntitiesParams['graphQL'] => {
  return {
    ...graphQL,
    queries(...args) {
      return reduce(
        [graphQL?.queries, bridge.transactions],
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
