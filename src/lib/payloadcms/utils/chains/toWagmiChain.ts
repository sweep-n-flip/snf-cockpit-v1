import { map, reduce } from 'lodash'

import {
  BlockExplorers,
  Chains,
  Contracts,
  RPCS,
  Project,
  Marketplaces,
  Media,
} from '@/lib/payloadcms/types/payload-types'

import { ChainCustom } from '@/lib/payloadcms/types/chains'

import { Chain } from '@/lib/web3/types'
import { Address } from 'viem'

export type ToWagmiChainParams = {
  chains: Chains[]
  project: Project
}

export const toWagmiChain = ({ chains }: ToWagmiChainParams): [Chain, ...Chain[]] => {
  const normalizedChains: Chain[] = map(chains, (chain) => ({
    id: chain.chainId,
    name: chain.name,
    testnet: Boolean(chain.testnet),
    custom: {
      logo: (chain.custom.logo as Media)?.url ? (chain.custom.logo as Media)?.url : undefined,
      slug: chain.slug,
      abis: reduce(
        chain.contracts as Contracts[],
        (acc, contract) => {
          if (contract.abi) {
            acc[contract.slug] = contract.abi
          }
          return acc
        },
        {} as ChainCustom['abis'],
      ),
      marketplaces: reduce(
        chain.custom.marketplaces as Marketplaces[],
        (acc, marketplace) => {
          acc[marketplace.slug] = marketplace
          return acc
        },
        {} as ChainCustom['marketplaces'],
      ),
    } as NonNullable<Chain['custom']>,
    blockExplorers: reduce(
      chain.blockExplorers as BlockExplorers[],
      (acc, blockExplorer) => {
        acc[blockExplorer.slug] = {
          name: blockExplorer.name,
          url: blockExplorer.url,
          apiUrl: blockExplorer.apiUrl ? blockExplorer.apiUrl : undefined,
        }
        return acc
      },
      {} as NonNullable<Chain['blockExplorers']>,
    ),
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals,
    } as Chain['nativeCurrency'],
    rpcUrls: reduce(
      chain.rpcs as RPCS[],
      (acc, rpc) => {
        acc[rpc.slug] = {
          http: map(rpc.http, (http) => http.url),
          webSocket: rpc.webSocket ? map(rpc.webSocket, (ws) => ws.url) : undefined,
        }
        return acc
      },
      {} as NonNullable<Chain['rpcUrls']>,
    ),
    contracts: reduce(
      chain.contracts as Contracts[],
      (acc, contract) => {
        acc[contract.slug] = {
          address: contract.address as Address,
          blockCreated: contract.blockCreated ? contract.blockCreated : undefined,
        }
        return acc
      },
      {} as NonNullable<Chain['contracts']>,
    ),
  }))

  return normalizedChains as [Chain, ...Chain[]]
}
