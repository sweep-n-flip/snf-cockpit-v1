import {
  Chain as WagmiChain,
  polygon,
  linea,
  avalancheFuji,
  arbitrumSepolia,
  bscTestnet,
} from 'wagmi/chains'

import { ChainContract } from 'viem'

export enum ChainId {
  BscTestnet = bscTestnet.id,
  Polygon = polygon.id,
  Linea = linea.id,
  AvalancheFuji = avalancheFuji.id,
  ArbitrumSepolia = arbitrumSepolia.id,
}

export type AvailableChainContracts = 'bridge_v1'

export enum Marketplace {
  Opensea,
}

export type ChainMarketplace = {
  id: Marketplace
  url: string
}

export type ChainMarketplaces = ChainMarketplace[]

export type ChainRPC = {
  http: readonly string[]
  webSocket?: readonly string[] | undefined
}

export type ChainRPCUrls = WagmiChain['rpcUrls'] & {
  protocol: ChainRPC
}

export type ChainContracts = WagmiChain['contracts'] & {
  [k in AvailableChainContracts]?: ChainContract
}

export type Chain = WagmiChain & {
  id: ChainId
  rpcUrls: ChainRPCUrls
  marketplaces: ChainMarketplaces
  contracts: ChainContracts
}

export type AllowedChains = {
  [key: Chain['id']]: Chain
}
