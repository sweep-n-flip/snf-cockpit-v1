import { AppConfig } from './types/config'
import { Nav, Page, Social } from './types/enums'

export type { AppConfig }
export { Nav, Page, Social }

export const appConfig: AppConfig = {
  name: "Sweep n' Flip",
  meta: {
    description:
      'The core of NFT liquidity. Buy and Sell NFTs instantly, and earn trading fees as a Liquidity Provider.',
    baseURL: 'https://sweepnflip.io',
  },
  navs: {
    [Nav.Main]: {
      [Page.Homepage]: {
        name: 'AMM for NFTs',
        description:
          'The core of NFT liquidity. Buy and Sell NFTs instantly, and earn trading fees as a Liquidity Provider.',
        path: '/',
      },
      [Page.Bridge]: {
        name: 'Bridge',
        description:
          'Bridge NFTs between different blockchains. Transfer NFTs between Ethereum, Binance Smart Chain, and more.',
        path: '/bridge/',
      },
    },
  },
  social: {
    [Social.Discord]: {
      url: 'https://discord.gg/vbVvj9MchB',
      label: 'Discord',
    },
    [Social.Github]: {
      url: 'https://github.com/sweep-n-flip',
      label: 'Github',
    },
    [Social.X]: {
      url: 'https://twitter.com/SweepnFlip',
      label: 'X',
    },
  },
  networks: {
    defaultChainId: +process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID!,
  },
  builder: {
    createdBy: 'NFTFY',
    url: 'https://www.nftfy.org',
  },
}

export default appConfig
