import { Context, GraphQLExtension } from '@/lib/payloadcms/plugins/snf/types'

import {
  TokensParams,
  TokensResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'

export const queryName = 'getERC721TokensByAddress'

export const tokens: GraphQLExtension = (GraphQL) => {
  return {
    [queryName]: {
      type: new GraphQL.GraphQLList(
        new GraphQL.GraphQLObjectType({
          name: queryName,
          fields: {
            tokenId: {
              type: GraphQL.GraphQLString,
            },
            name: {
              type: GraphQL.GraphQLString,
            },
            image: {
              type: GraphQL.GraphQLString,
            },
            collectionName: {
              type: GraphQL.GraphQLString,
            },
            collectionImageUrl: {
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
      resolve: async (_: any, args: TokensParams, context: Context): Promise<TokensResponse> => {
        const { chainId, address, collectionAddress } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          /// todo: handle error
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: TokensResponse },
          TokensParams
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
