import { reduce, merge } from 'lodash'
import { webSocket, createConfig, http, fallback, Config } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { Transport } from 'viem'
import { getDefaultConfig } from 'connectkit'
import { walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { Chain } from '@/lib/web3/types'

export type ConfigParams = {
  chains: [Chain, ...Chain[]]
  appName: string
  appDescription: string
  appUrl: string
}

export const fallbackChain: Chain = {
  ...mainnet,
  custom: {
    logo: '',
    slug: 'ethereum',
    abis: {},
    marketplaces: {},
  },
}

export const config = ({
  chains = [fallbackChain],
  appName,
  appDescription,
  appUrl,
}: ConfigParams): Config => {
  const transports = reduce(
    chains,
    (
      acc: {
        [key: string]: Transport
      },
      chain: Chain,
    ) => {
      const websockets = Object.values(chain.rpcUrls)
        .filter((rpc) => !!rpc.webSocket?.length)
        .map((rpc) => rpc.webSocket!.map((wsData) => webSocket(wsData)))
        .flat()

      const https = Object.values(chain.rpcUrls)
        .filter((rpc) => !!rpc.http.length)
        .map((rpc) => rpc.http.map((httpData) => http(httpData)))
        .flat()

      return merge(acc, {
        [chain.id]: fallback([...websockets, ...https]),
      })
    },
    {},
  )

  return createConfig(
    getDefaultConfig({
      ssr: typeof window === 'undefined',
      appName: appName,
      appDescription: appDescription,
      appUrl: appUrl,
      chains: chains,
      transports,
      /// todo: connectors from payload?
      connectors: [
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          disableProviderPing: true,
          showQrModal: false,
        }),
        coinbaseWallet({
          appName: appName,
          darkMode: true,
          preference: 'smartWalletOnly',
        }),
      ],
      walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID!,
    }),
  )
}
