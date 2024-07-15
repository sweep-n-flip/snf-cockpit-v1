import { reduce, merge } from 'lodash'
import { ChainId, allowedChains, chains } from '@/lib/web3/config/chains'
import { getChain } from '@/lib/web3/config/utils'
import { Chain } from '@/lib/web3/types/chain'
import { webSocket, createConfig, http, fallback, Config } from 'wagmi'
import { Transport } from 'viem'
import { appConfig } from '@/lib/config'
import { getDefaultConfig } from 'connectkit'
import { walletConnect, coinbaseWallet } from 'wagmi/connectors'

export const app = {
  appName: appConfig.name,
  appDescription: appConfig.meta.description,
  appUrl: appConfig.meta.baseURL,
}

export const alchemyConfig = {
  key: 'alchemy',
  retryCount: 5,
  retryDelay: 100,
}

export const transports = reduce(
  allowedChains,
  (
    acc: {
      [key in ChainId]: Transport
    },
    chain: Chain,
  ) =>
    merge(acc, {
      [chain.id]: fallback([
        ...(getChain(chain.id).rpcUrls.protocol?.webSocket?.[0]
          ? [webSocket(getChain(chain.id).rpcUrls.protocol?.webSocket?.[0], alchemyConfig)]
          : []),
        http(getChain(chain.id).rpcUrls.protocol?.http?.[0], alchemyConfig),
        http(getChain(chain.id).rpcUrls.default?.http?.[0], alchemyConfig),
      ]),
    }),
  {},
)

export const defaultChain = allowedChains[appConfig.networks.defaultChainId]

export const config = (): Config => {
  return createConfig(
    getDefaultConfig({
      ssr: typeof window === 'undefined',
      chains,
      transports,
      connectors: [
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          disableProviderPing: true,
          showQrModal: false,
        }),
        coinbaseWallet({
          appName: appConfig.name,
          darkMode: true,
          preference: 'smartWalletOnly',
        }),
      ],
      walletConnectProjectId: process.env.WALLET_CONNECT_PROJECT_ID!,
      ...app,
    }),
  )
}
