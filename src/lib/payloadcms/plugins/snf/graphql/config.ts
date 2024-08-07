import type { Config, GraphQLConfigParams } from '@/lib/payloadcms/plugins/snf/types'

export type ConfigParams = {
  config: Config
  graphQL?: GraphQLConfigParams
}

export const config = ({ config, graphQL }: ConfigParams): Config => {
  if (!graphQL) {
    throw new Error('Missing GraphQL configuration')
  }

  const { query, queries, mutate, mutations, subscribe, subscriptions } = graphQL

  return {
    ...config,
    custom: {
      ...(config.custom || {}),
      graphQL: {
        query,
        mutate,
        subscribe,
        queries,
        mutations,
        subscriptions,
      },
    },
  }
}
