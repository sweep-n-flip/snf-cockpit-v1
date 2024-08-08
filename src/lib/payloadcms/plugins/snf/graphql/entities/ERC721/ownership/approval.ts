import { Context, GraphQLExtension } from '@/lib/payloadcms/plugins/snf/types'

import {
  IsApprovedForAllParams,
  IsApprovedForAllResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'

export const queryName = 'getERC721IsApprovedForAll'

export const approval: GraphQLExtension = (GraphQL) => {
  return {
    [queryName]: {
      type: new GraphQL.GraphQLObjectType({
        name: queryName,
        fields: {
          isApprovedForAll: {
            type: GraphQL.GraphQLBoolean,
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
        operatorAddress: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
        },
      },
      resolve: async (
        _: any,
        args: IsApprovedForAllParams,
        context: Context,
      ): Promise<IsApprovedForAllResponse> => {
        const { chainId, ownerAddress, collectionAddress, operatorAddress } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          /// todo: handle error
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: IsApprovedForAllResponse },
          IsApprovedForAllParams
        >({
          query: context.req.payload.config.custom.graphQL.queries?.[queryName],
          variables: {
            chainId,
            ownerAddress,
            collectionAddress,
            operatorAddress,
          },
        })

        return result?.data[queryName]
      },
    },
  }
}
