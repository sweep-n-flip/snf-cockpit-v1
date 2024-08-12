import type { Config } from 'payload'
import reduce from 'lodash/reduce'

import { bridge } from './bridge'
import { ERC721 } from './ERC721'

export type EntitiesParams = {
  graphQL: Config['graphQL']
}

export const entities = ({ graphQL }: EntitiesParams): EntitiesParams['graphQL'] => {
  return {
    ...graphQL,

    queries(...args) {
      return reduce(
        [
          graphQL?.queries,
          /// @dev: bridge graphql queries
          ...Object.values(bridge.transactions),
          /// @dev: ERC721 graphql queries
          ...Object.values(ERC721.ownership),
          ...Object.values(ERC721.wallet),
        ],
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
