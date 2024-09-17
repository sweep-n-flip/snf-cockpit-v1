import { Context, GraphQLExtension } from '@/lib/payloadcms/plugins/snf/types'

import {
  CollectionsParams,
  CollectionsResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'

export const queryName = 'getERC721Collections'

export const collections: GraphQLExtension = (GraphQL) => {
  return {
    [queryName]: {
      type: new GraphQL.GraphQLList(
        new GraphQL.GraphQLObjectType({
          name: queryName,
          fields: {
            collections: {
              type: new GraphQL.GraphQLList(
                new GraphQL.GraphQLObjectType({
                  name: 'ERC721OwnerCollection',
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
      },
      resolve: async (
        _: any,
        args: CollectionsParams,
        context: Context,
      ): Promise<CollectionsResponse> => {
        const { chainId, address } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: CollectionsResponse },
          CollectionsParams
        >({
          query: context.req.payload.config.custom.graphQL.queries?.[queryName],
          variables: {
            chainId,
            address,
          },
        })

        return result?.data[queryName]?.collections
      },
    },
  }
}
