import { Context, Plugin } from '@/lib/payloadcms/plugins/snf/types'

export type SearchCollectionsParams = {
  chainId: number
  query?: string
  limit?: number
}

export type CollectionItem = {
  id: string
  address: string
  chainId: number
  name?: string
  symbol?: string
  description?: string
  image?: string
  banner?: string
  tokenCount?: number
  ownerCount?: number
  floorPrice?: string
  totalVolume?: string
  lastUpdated: Date
}

export type SearchCollectionsResponse = CollectionItem[]

const queryName = 'searchCollections'

export const search = (): Plugin<SearchCollectionsParams, SearchCollectionsResponse> => {
  return {
    name: 'search',
    queries: {
      [queryName]: {
        name: queryName,
        description: 'Search collections from cache',
        args: {
          chainId: {
            type: 'Int!',
            description: 'Chain ID',
          },
          query: {
            type: 'String',
            description: 'Search term',
          },
          limit: {
            type: 'Int',
            description: 'Limit',
          },
        },
        resolve: async (
          _: unknown,
          args: SearchCollectionsParams,
          context: Context,
        ): Promise<SearchCollectionsResponse> => {
          const { chainId, query, limit } = args

          if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
            throw new Error(`${queryName} query is not defined`)
          }

          const result = await context.req.payload.config.custom.graphQL.query<
            { [queryName: string]: SearchCollectionsResponse },
            SearchCollectionsParams
          >({
            query: context.req.payload.config.custom.graphQL.queries?.[queryName],
            variables: {
              chainId,
              query,
              limit,
            },
          })

          return result?.data[queryName] || []
        },
      },
    },
  }
}

export default search
