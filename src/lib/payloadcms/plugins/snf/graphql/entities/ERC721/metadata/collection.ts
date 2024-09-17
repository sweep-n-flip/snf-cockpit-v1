import { Context, GraphQLExtension } from '@/lib/payloadcms/plugins/snf/types'

import {
  CollectionMetadataParams,
  CollectionMetadataResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/metadata/types'

export const queryName = 'getERC721CollectionMetadata'

export const collectionMetadata: GraphQLExtension = (GraphQL) => {
  return {
    [queryName]: {
      type: new GraphQL.GraphQLObjectType({
        name: queryName,
        fields: {
          name: {
            type: GraphQL.GraphQLString,
          },
          symbol: {
            type: GraphQL.GraphQLString,
          },
          description: {
            type: GraphQL.GraphQLString,
          },
          image: {
            type: GraphQL.GraphQLString,
          },
        },
      }),
      args: {
        chainId: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
        },
        collectionAddress: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
        },
      },
      resolve: async (
        _: any,
        args: CollectionMetadataParams,
        context: Context,
      ): Promise<CollectionMetadataResponse> => {
        const { chainId, collectionAddress } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: CollectionMetadataResponse },
          CollectionMetadataParams
        >({
          query: context.req.payload.config.custom.graphQL.queries?.[queryName],
          variables: {
            chainId,
            collectionAddress,
          },
        })

        return result?.data[queryName]
      },
    },
  }
}
