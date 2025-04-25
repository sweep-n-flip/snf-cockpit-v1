import type { EntitiesParams } from '@/lib/payloadcms/plugins/snf/types'
import type { GraphQLExtension } from 'payload'

import { amm } from './amm'
import { bridge } from './bridge'
import { ERC721 } from './ERC721'

export const entities = ({ graphQL }: EntitiesParams): EntitiesParams['graphQL'] => {
  return {
    ...graphQL,

    // Usamos cast para unknown antes de converter para GraphQLExtension
    queries: (function queries(
      name: any, 
      schema: any, 
      options: any
    ) {
      const bridgeTransactions = bridge.transactions || {}
      const erc721Ownership = ERC721.ownership || {}
      const erc721Metadata = ERC721.metadata || {}
      const ammQueries = amm.resolvers || {}
      
      const queryFns = [
        graphQL?.queries,
        /// @dev: bridge graphql queries
        ...Object.values(bridgeTransactions),
        /// @dev: ERC721 graphql queries
        ...Object.values(erc721Ownership),
        ...Object.values(erc721Metadata),
      ]

      const result = {}
      
      // Process traditional queries
      for (const fn of queryFns) {
        if (typeof fn === 'function') {
          // @ts-ignore 
          Object.assign(result, fn.call(this, name, schema, options))
        }
      }
      
      // Add AMM queries directly (without call)
      Object.assign(result, ammQueries)
      
      return result
    }) as unknown as GraphQLExtension,
  }
}
