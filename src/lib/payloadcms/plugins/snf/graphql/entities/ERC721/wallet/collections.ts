import { Context, GraphQLExtension } from '@/lib/payloadcms/plugins/snf/types'

import {
  CollectionsParams,
  CollectionsResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'

export const queryName = 'getERC721CollectionsByAddress'

export const collections: GraphQLExtension = (GraphQL) => {
  return {
    [queryName]: {
      type: new GraphQL.GraphQLList(
        new GraphQL.GraphQLObjectType({
          name: queryName,
          fields: {
            address: {
              type: GraphQL.GraphQLString,
            },
            name: {
              type: GraphQL.GraphQLString,
            },
            image: {
              type: GraphQL.GraphQLString,
            },
            tokenCount: {
              type: GraphQL.GraphQLString,
            },
          },
        }),
      ),
      args: {
        chainId: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
        },
        address: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
        },
        collectionAddress: {
          type: GraphQL.GraphQLString,
        },
      },
      resolve: async (
        _: any,
        args: CollectionsParams,
        context: Context,
      ): Promise<CollectionsResponse> => {
        const { chainId, address, collectionAddress } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          /// todo: handle error
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: CollectionsResponse },
          CollectionsParams
        >({
          query: context.req.payload.config.custom.graphQL.queries?.[queryName],
          variables: {
            chainId,
            collectionAddress,
            address,
          },
        })

        return result?.data[queryName]
      },
    },
  }
}
