import type { Config as PayloadConfig, PayloadRequest } from 'payload'
import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client/core'

export type { PayloadConfig, PayloadRequest }

export type GraphQLConfigParams = {
  query: ApolloClient<NormalizedCacheObject>['query']
  mutate?: ApolloClient<NormalizedCacheObject>['mutate']
  subscribe?: ApolloClient<NormalizedCacheObject>['subscribe']
  queries?: Record<string, DocumentNode>
  mutations?: Record<string, DocumentNode>
  subscriptions?: Record<string, DocumentNode>
}

export type PluginParams = {
  graphQL?: GraphQLConfigParams
}

export interface Config extends PayloadConfig {
  custom?: PluginParams & PayloadConfig['custom']
}
