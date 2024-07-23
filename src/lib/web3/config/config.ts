import { reduce, merge } from 'lodash'
import { webSocket, createConfig, http, fallback, Config } from 'wagmi'
import { Transport } from 'viem'
import { getDefaultConfig } from 'connectkit'
import { walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { Chains, Project } from '@/lib/payloadcms/types/payload-types'
import { Chain } from '@/lib/web3/types'
import { toWagmiChain } from '@/lib/payloadcms/utils/chains/toWagmiChain'

export type ConfigParams = {
  chains: Chains[]
  project: Project
}

export const config = ({ chains, project }: ConfigParams): Config => {
  const normalizedChains = toWagmiChain({ chains, project })

  const transports = reduce(
    normalizedChains,
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
      appName: project.name,
      appDescription: String(project.description),
      appUrl: String(project.url),
      chains: normalizedChains,
      transports,
      /// todo: connectors from payload?
      connectors: [
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          disableProviderPing: true,
          showQrModal: false,
        }),
        coinbaseWallet({
          appName: project.name,
          darkMode: true,
          preference: 'smartWalletOnly',
        }),
      ],
      walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID!,
    }),
  )
}
