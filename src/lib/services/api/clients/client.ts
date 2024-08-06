import { HttpLink } from '@apollo/client'

export const httpClient = new HttpLink({
  uri: '/api/graphql',
})
