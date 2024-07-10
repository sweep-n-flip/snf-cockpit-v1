import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { httpLink } from '@/lib/services/api/links/http'

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

const link = ApolloLink.from([httpLink, retryLink])
const cache = new InMemoryCache()

export const client = new ApolloClient({
  ssrMode: typeof window !== 'undefined',
  link,
  cache,
})

export default client
