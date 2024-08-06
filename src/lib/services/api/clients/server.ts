import { HttpLink } from '@apollo/client'

export const httpServer = new HttpLink({
  uri: process.env.NEXT_PUBLIC_HEADLESS_API_URI,
})
