import { ApolloLink } from '@apollo/client'
import { httpClient } from '@/lib/services/api/clients'

export const httpLink = new ApolloLink((operation, forward) => {
  operation.getContext
  /// switch http link external internal if context
  /// http middleware logic here
  return httpClient.request(operation, forward)
})

export default httpLink
