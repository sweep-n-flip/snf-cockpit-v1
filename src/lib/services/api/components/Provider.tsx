'use client'

import { type ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { client } from '@/lib/services/api/config/client'

export type ServiceProviderProps = {
  children: ReactNode
}

export function ServiceProvider({ children }: ServiceProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ServiceProvider
