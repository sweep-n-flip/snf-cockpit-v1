'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config, ConfigParams } from '@/lib/web3/config/config'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

export type Web3ProviderProps = ConfigParams & {
  children: ReactNode
}

export const Web3Provider = ({ children, ...configProps }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config(configProps)}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            enforceSupportedChains: false,
            embedGoogleFonts: true,
            avoidLayoutShift: true,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
