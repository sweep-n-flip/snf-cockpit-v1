import type { GraphQLExtension } from 'payload'
import { ResolverContext } from '@/lib/payloadcms/plugins/snf/graphql/entities/types'
import { QueryParams } from '@/lib/payloadcms/plugins/snf/graphql/entities/bridge/transactions/types'

export const queryName = 'getBridgeTransactionStatus'

export const status: GraphQLExtension = (GraphQL) => {
  return {
    [queryName]: {
      type: new GraphQL.GraphQLObjectType({
        name: queryName,
        fields: {
          status: {
            type: GraphQL.GraphQLString,
          },
        },
      }),
      args: {
        chainId: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
        },
        transactionHash: {
          type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
        },
      },
      resolve: async (_: any, args: QueryParams, context: ResolverContext) => {
        const { chainId, transactionHash } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query({
          query: context.req.payload.config.custom.graphQL.queries[queryName],
          variables: {
            chainId,
            transactionHash,
          },
        })

        return result?.data[queryName]
      },
    },
  }
}
