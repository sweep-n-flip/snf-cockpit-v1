import { Context, GraphQLExtension } from '@/lib/payloadcms/plugins/snf/types'

import {
  BalanceParams,
  BalanceResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'

export const queryName = 'getERC721Balance'

export const balance: GraphQLExtension = (GraphQL) => {
  return {
    [queryName]: {
      type: new GraphQL.GraphQLObjectType({
        name: queryName,
        fields: {
          tokenIds: {
            type: new GraphQL.GraphQLList(GraphQL.GraphQLString),
          },
          collectionAddress: {
            type: GraphQL.GraphQLString,
          },
          chainId: {
            type: GraphQL.GraphQLInt,
          },
          ownerAddress: {
            type: GraphQL.GraphQLString,
          },
          count: {
            type: GraphQL.GraphQLInt,
          },
        },
      }),
      args: {
        chainId: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
        },
        ownerAddress: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
        },
        collectionAddress: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
        },
      },
      resolve: async (_: any, args: BalanceParams, context: Context): Promise<BalanceResponse> => {
        const { chainId, ownerAddress, collectionAddress } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: BalanceResponse },
          BalanceParams
        >({
          query: context.req.payload.config.custom.graphQL.queries?.[queryName],
          variables: {
            chainId,
            ownerAddress,
            collectionAddress,
          },
        })

        return result?.data[queryName]
      },
    },
  }
}
