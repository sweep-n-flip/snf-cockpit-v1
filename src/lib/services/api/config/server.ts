import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { httpServer } from '@/lib/services/api/clients/server'

const cache = new InMemoryCache()

export const serverClient = new ApolloClient({
  ssrMode: true,
  link: httpServer,
  cache,
})

export default serverClient
