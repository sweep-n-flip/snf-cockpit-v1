import { ApolloClient, InMemoryCache } from '@apollo/client/core'

const cache = new InMemoryCache()

export const serverClient = new ApolloClient({
  ssrMode: true,
  uri: process.env.NEXT_PUBLIC_HEADLESS_API_URI,
  cache,
})

export default serverClient
