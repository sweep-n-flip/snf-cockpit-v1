'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/web3/config/config'

const queryClient = new QueryClient()

export const Web3Provider = ({ children }: any) => {
  return (
    <WagmiProvider config={config()}>
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
