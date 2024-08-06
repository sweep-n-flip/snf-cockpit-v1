import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { httpServer } from '@/lib/services/api/clients/server'

const retryLink = new RetryLink({
  delay: {
    initial: 1000,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 20,
    retryIf: (error) => {
      return !!error
    },
  },
})

const link = ApolloLink.from([httpServer, retryLink])
const cache = new InMemoryCache()

export const serverClient = new ApolloClient({
  ssrMode: true,
  link,
  cache,
})

export default serverClient
