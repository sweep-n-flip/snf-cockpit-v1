import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client/core'
import type { GraphQLExtension, Config as PayloadConfig, PayloadRequest } from 'payload'

export type { GraphQLExtension, PayloadConfig, PayloadRequest }

export type GraphQLConfigParams = {
  query: ApolloClient<NormalizedCacheObject>['query']
  mutate: ApolloClient<NormalizedCacheObject>['mutate']
  subscribe: ApolloClient<NormalizedCacheObject>['subscribe']
  queries: Record<string, DocumentNode>
  mutations: Record<string, DocumentNode>
  subscriptions: Record<string, DocumentNode>
}

export type GraphQLEntitiesParams = {
  graphQL?: PayloadConfig['graphQL']
}

export type EntitiesParams = {
  graphQL: PayloadConfig['graphQL']
}

export type PluginParams = {
  graphQL?: GraphQLConfigParams
}

export interface Config extends PayloadConfig {
  custom?: PluginParams & PayloadConfig['custom']
}

export type Context = {
  req: PayloadRequest & {
    payload: PayloadRequest['payload'] & {
      config: Config
    }
  }
}
