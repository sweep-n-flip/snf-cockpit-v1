import { Context } from '@/lib/payloadcms/plugins/snf/types'

export type Plugin = {
  name: string
  query?: {
    name: string
    description: string
    args: Record<string, any>
    resolve: (parent: unknown, args: any, context: Context) => Promise<any>
  }
}

export type CollectionParams = {
  chainId: number
  address: string
}

export type CollectionResponse = {
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

const queryName = 'getCollection'

export const collection = (): Plugin => {
  return {
    name: 'collection',
    query: {
      name: queryName,
      description: 'Get collection metadata from cache',
      args: {
        chainId: {
          type: 'Int!',
          description: 'Chain ID',
        },
        address: {
          type: 'String!',
          description: 'Collection address',
        },
      },
      resolve: async (
        _: unknown,
        args: CollectionParams,
        context: Context,
      ): Promise<CollectionResponse | null> => {
        const { chainId, address } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: CollectionResponse },
          CollectionParams
        >({
          query: context.req.payload.config.custom.graphQL.queries?.[queryName],
          variables: {
            chainId,
            address,
          },
        })

        return result?.data[queryName]
      },
    },
  }
}

export default collection
