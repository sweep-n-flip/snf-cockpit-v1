import type { Config, GraphQLConfigParams } from '@/lib/payloadcms/plugins/snf/types'

export type ConfigParams = {
  config: Config
  graphQL?: GraphQLConfigParams
}

export const config = ({ config, graphQL }: ConfigParams): Config => {
  const { query, queries, mutate, mutations, subscribe, subscriptions } = graphQL || {}
  /// @dev: Check if the required GraphQL configuration is present
  if (!query || !mutate || !subscribe) {
    throw new Error('Missing GraphQL configuration')
  }

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
