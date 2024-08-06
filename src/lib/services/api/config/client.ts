import { ApolloClient, InMemoryCache } from '@apollo/client'
import { httpClient } from '@/lib/services/api/clients/client'

const cache = new InMemoryCache()

export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: httpClient,
  cache,
})

export default client
