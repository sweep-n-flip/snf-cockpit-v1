import { HttpLink } from '@apollo/client'

export const httpClient = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HEADLESS_API_URI,
})
