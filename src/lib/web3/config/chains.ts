import { linea, avalancheFuji, arbitrumSepolia, bscTestnet, polygon } from 'wagmi/chains'

import { merge, reduce } from 'lodash'

import { Chain, AllowedChains, ChainId, Marketplace } from '@/lib/web3/types/chain'

export { ChainId }

export const lineaChain: Chain = merge(linea, {
  id: ChainId.Linea,
})

export const polygonChain: Chain = merge(polygon, {
  id: ChainId.Polygon,
  rpcUrls: {
    protocol: {
      http: [
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_POLYGON}`,
      ],
      webSocket: [
        `wss://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_POLYGON}`,
      ],
    },
  },
})

export const avalancheFujiChain: Chain = merge(avalancheFuji, {
  id: ChainId.AvalancheFuji,
  marketplaces: [
    {
      id: Marketplace.Opensea,
      url: 'https://testnets.opensea.io/assets/avalanche-fuji',
      urlTokenIdPath: '/{{address}}/{{tokenInd}}',
    },
  ],
  contracts: {
    bridge_v1: {
      address: '0x8d6B12D51C631dAA0AE9a36318270721f544F563',
    },
  },
})

export const arbitrumSepoliaChain: Chain = merge(arbitrumSepolia, {
  id: ChainId.ArbitrumSepolia,
  rpcUrls: {
    protocol: {
      http: [
        `https://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_ARBITRUM_SEPOLIA}`,
      ],
      webSocket: [
        `wss://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_ARBITRUM_SEPOLIA}`,
      ],
    },
  },
  marketplaces: [
    {
      id: Marketplace.Opensea,
      url: 'https://testnets.opensea.io/assets/arbitrum-sepolia',
      urlTokenIdPath: '/{{address}}/{{tokenInd}}',
    },
  ],
  contracts: {
    bridge_v1: {
      address: '0xc739654D9B56D71490d098a9518C1b06972A05d2',
    },
  },
})

export const bscTestnetChain: Chain = merge(bscTestnet, {
  name: 'BSC',
  id: ChainId.BscTestnet,
  marketplaces: [
    {
      id: Marketplace.Opensea,
      /// shortCodeParser is a function that replaces {{address}} with the collection address
      url: 'https://testnets.opensea.io/assets/bsc-testnet',
      urlTokenIdPath: '/{{address}}/{{tokenInd}}',
    },
  ],
  contracts: {
    bridge_v1: {
      address: '0xa00465DacFb4Daa589D92885899c928cc7e7ae58',
    },
  },
})

export const mainnets: [Chain, ...Chain[]] = [polygonChain, lineaChain]

export const testnets: [Chain, ...Chain[]] = [
  arbitrumSepoliaChain,
  avalancheFujiChain,
  bscTestnetChain,
]

export const chains: [Chain, ...Chain[]] =
  process.env.NEXT_PUBLIC_TESTNET_NETWORKS === 'true' ? testnets : mainnets

export const allowedChains: AllowedChains = reduce(
  chains,
  (
    acc: {
      [k in ChainId]: Chain
    },
    chain: Chain,
  ) =>
    merge(acc, {
      [chain.id]: chain,
    }),
  {},
)
