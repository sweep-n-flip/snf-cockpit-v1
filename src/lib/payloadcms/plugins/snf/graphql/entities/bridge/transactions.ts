import type { GraphQLExtension } from 'payload'
import { ResolverContext } from '@/lib/payloadcms/plugins/snf/graphql/entities/types'
import { BridgeTransactionStatusParams } from '@/lib/payloadcms/plugins/snf/graphql/entities/bridge/types'

export const transactions: GraphQLExtension = (GraphQL) => {
  return {
    getBridgeTransactionStatus: {
      type: new GraphQL.GraphQLObjectType({
        name: 'getBridgeTransactionStatus',
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
      resolve: async (_: any, args: BridgeTransactionStatusParams, context: ResolverContext) => {
        const { chainId, transactionHash } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.getBridgeTransactionStatus) {
          throw new Error('getBridgeTransactionStatus query is not defined')
        }

        const result = await context.req.payload.config.custom.graphQL.query({
          query: context.req.payload.config.custom.graphQL.queries.getBridgeTransactionStatus,
          variables: {
            chainId,
            transactionHash,
          },
        })

        return result?.data.getBridgeTransactionStatus
      },
    },
  }
}
