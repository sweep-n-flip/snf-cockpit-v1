import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache()

export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  uri: '/api/graphql',
  cache,
})

export default client
