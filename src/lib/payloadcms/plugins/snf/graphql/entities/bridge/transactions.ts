/* eslint-disable @typescript-eslint/no-unused-vars */
import type { GraphQLExtension } from 'payload'

export const transactions: GraphQLExtension = (GraphQL) => {
  return {
    GetBridgeTransactionStatus: {
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
      async resolve() {
        // const { chainId, transactionHash } = args
        // const { data } = await context.api.getBridgeTransactionStatus({ chainId, transactionHash })
        console.log(...arguments)
        return 'pending'
      },
    },
  }
}
