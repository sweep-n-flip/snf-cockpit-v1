'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { config } from '@/lib/web3/config/config'
import { ReactNode } from 'react'
import { Chains, Project } from '@/lib/payloadcms/types/payload-types'

const queryClient = new QueryClient()

export type Web3ProviderProps = {
  children: ReactNode
  chains: Chains[]
  project: Project
}

export const Web3Provider = ({ chains, project, children }: Web3ProviderProps) => {
  return (
    <WagmiProvider config={config({ chains, project })}>
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
