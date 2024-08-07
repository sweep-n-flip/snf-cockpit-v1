import { Context, GraphQLExtension } from '@/lib/payloadcms/plugins/snf/types'

import {
  QueryStatusParams,
  QueryStatusResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/bridge/transactions/types'

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
      resolve: async (
        _: any,
        args: QueryStatusParams,
        context: Context,
      ): Promise<QueryStatusResponse> => {
        const { chainId, transactionHash } = args

        if (!context.req.payload.config.custom.graphQL?.queries?.[queryName]) {
          /// todo: handle error
          throw new Error(`${queryName} query is not defined`)
        }

        const result = await context.req.payload.config.custom.graphQL.query<
          { [queryName: string]: QueryStatusResponse },
          QueryStatusParams
        >({
          query: context.req.payload.config.custom.graphQL.queries?.[queryName],
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
