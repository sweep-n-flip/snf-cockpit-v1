import { Logger } from '@/lib/services/logger'
import { SupportedExchanges } from './exchange.enums'

interface Protocol {
  name: string
  url: string
}

export interface ExchangeConfig {
  url: string
  slippage: number
  protocols: Protocol[]
  networkTokenAddress: string
  name: SupportedExchanges
}

export interface RockpoolConfig {
  theGraph: string
}

export interface OpenseaConfig {
  assetUrl: string
}

interface RewardsConfig {
  theGraph: string
  contract: {
    erc20Factory: string
    erc1155Factory: string
    erc721Factory: string
    nativeFactory: string
  }
}

interface AlchemyConfig {
  rpc: string
  key: string | undefined
}

interface OpenseaApiConfig {
  api: string
  key: string | undefined
}

interface ContentfulConfig {
  apiKey: string | undefined
  graphQl: string | undefined
}

interface GlobalConfig {
  limit: number
  nftfyTax: number
  pinata: {
    url: string
  }
  alchemy: {
    ethereum: AlchemyConfig
    rinkeby: AlchemyConfig
    arbitrum: AlchemyConfig
    goerli: AlchemyConfig
    polygon: AlchemyConfig
    base: AlchemyConfig
    blast: AlchemyConfig
    mumbai: AlchemyConfig
    optimism: AlchemyConfig
    avalanche: AlchemyConfig
    linea: AlchemyConfig
    bsc: AlchemyConfig
  }
  opensea: {
    mainnet: OpenseaApiConfig
    testnet: OpenseaApiConfig
  }
  uniswap: {
    v2: {
      theGraph: string
    }
  }
  contentful: ContentfulConfig
  moralis: {
    api: string
  }
}

interface ReservoirConfig {
  apiUrl: string
}

export interface SelectedFloorCollections {
  chainId: number
  collectionAddress: string
  collectionName: string
  collectionSlug: string
  imageUrl?: string
}

export interface SweepAndFlipConfig {
  amm: {
    theGraph: string
    useSubsquid?: boolean
  }
}

export const globalConfig: GlobalConfig = {
  limit: 8,
  nftfyTax: 0.07,
  pinata: {
    url: 'https://api.pinata.cloud',
  },
  alchemy: {
    ethereum: {
      rpc: 'https://eth-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MAINNET_KEY,
    },
    rinkeby: {
      rpc: 'https://eth-rinkeby.g.alchemy.com/v2',
      key: process.env.ALCHEMY_RINKEBY_KEY,
    },
    arbitrum: {
      rpc: 'https://arb-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_ARBITRUM_KEY,
    },
    goerli: {
      rpc: 'https://eth-goerli.g.alchemy.com/v2',
      key: process.env.ALCHEMY_GOERLI_KEY,
    },
    polygon: {
      rpc: 'https://polygon-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_POLYGON_KEY,
    },
    mumbai: {
      rpc: 'https://polygon-mumbai.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MUMBAI_KEY,
    },
    avalanche: {
      rpc: 'https://eth-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MAINNET_KEY,
    },
    base: {
      rpc: 'https://eth-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MAINNET_KEY,
    },
    linea: {
      rpc: 'https://eth-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MAINNET_KEY,
    },
    blast: {
      rpc: 'https://eth-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MAINNET_KEY,
    },
    optimism: {
      rpc: 'https://eth-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MAINNET_KEY,
    },
    bsc: {
      rpc: 'https://eth-mainnet.g.alchemy.com/v2',
      key: process.env.ALCHEMY_MAINNET_KEY,
    },
  },
  opensea: {
    mainnet: {
      api: 'https://api.opensea.io/api/v1',
      key: process.env.OPENSEA_KEY,
    },
    testnet: {
      api: 'https://testnets-api.opensea.io/api/v1',
      key: process.env.OPENSEA_KEY,
    },
  },
  uniswap: {
    v2: {
      theGraph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    },
  },
  moralis: {
    api: 'https://deep-index.moralis.io/api/v2',
  },
  contentful: {
    apiKey: process.env.CONTENTFUL_API_GRAPHQL_KEY,
    graphQl: process.env.CONTENTFUL_API_URL,
  },
}

export interface ChainConfig {
  chainId: number
  hexChainId?: string
  name: string
  isTestnet: boolean
  rpcAddress: string
  network: {
    token: {
      address: string
      wrappedAddress: string
      decimals: number
      symbol: string
    }
  }
  stablecoinAddress: string
  marketplace: {
    theGraph: string
  }
  box: {
    contract: string
    theGraph: string
  }
  fractionalizer: {
    contractFixedPrice: string
    contractAuction: string
    theGraph: string
  }
  crowdpad: {
    contract: string
    theGraph: string
  }
  buyFloor: {
    contract: string
    theGraph: string
  }
  fractionalizerV1: {
    contract: string
    theGraph: string
  }
  trendingItems: string[]
  exchange?: ExchangeConfig
  rockpool?: RockpoolConfig
  openseaConfig?: OpenseaConfig
  hub?: RewardsConfig
  topCollectionsFirebaseKey?: string
  reservoir?: ReservoirConfig
  alchemyApiUrl?: string
  selectedCollections?: SelectedFloorCollections[]
  sweepAndFlip?: SweepAndFlipConfig
}

const chainsConfig: ChainConfig[] = [
  {
    chainId: 1,
    name: 'Mainnet',
    isTestnet: false,
    rpcAddress: `${globalConfig.alchemy.ethereum.rpc}/${globalConfig.alchemy.ethereum.key}`,
    network: {
      token: {
        wrappedAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    stablecoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    marketplace: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmaZWACCH63FenSuDkiTLSRsBuGh3bZgvALVMRtpPHMEM4',
    },
    box: {
      contract: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmXBX2oBntKD9oF2fiR4EcjCctPdnGH7zL1bhC27sLauCS',
    },
    fractionalizer: {
      contractFixedPrice: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      contractAuction: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmVPuw6zG1dgmm653NLtBXFQQyjdLnZJybJ9GaisBhxuHk',
    },
    fractionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmbyGktJeAKb1UjtYkrdzE8fswMZCAGa8xRM3akSahYqvx',
    },
    trendingItems: [
      '0x1e95b705dbbb3e1128445afc06d9da401552fdcb#16',
      '0x4fc1d1118b2754366a2e53c486139a14059d2e75',
      '0xa6eb2b9a95b4c217867814f28f42cc345643f9c6',
      '0xf90ba84adc07416d4bd56edae16a5c21b5e5f08b',
    ],
    crowdpad: {
      contract: '0x1e95B705Dbbb3E1128445aFc06D9dA401552FDCb',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/Qmb6yxu8eRDfikmgmzso9s3WKCrBYxs1KCvNkjUPY9wYkj',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: 'https://api.1inch.exchange/v4.0/1',
      slippage: 0.01,
      protocols: [
        { name: 'UNISWAP_V1', url: '' },
        { name: 'UNISWAP_V2', url: '' },
        { name: 'BALANCER', url: '' },
        { name: 'ZRX', url: '' },
        { name: 'ONE_INCH_LIMIT_ORDER', url: '' },
      ],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmWnZpfoTFk2dyuGU4BRqxtxeSVJ4Ny9R5spoeH8daMq2d',
    },
    openseaConfig: {
      assetUrl: 'https://opensea.io/assets',
    },
    topCollectionsFirebaseKey: 'mainnet-top-collections',
    reservoir: {
      apiUrl: 'https://api.reservoir.tools',
    },
    alchemyApiUrl: `${globalConfig.alchemy.ethereum.rpc}/${globalConfig.alchemy.ethereum.key}`,
    hub: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmbEyed8kaShPrbyfSpkAAoG8UmyAmZxUp1Ux8rLGv73jK',
      contract: {
        erc721Factory: '0x90c335dA5778c9cB917A3cF62Ee0C0138699745f',
        erc20Factory: '0x45d28CD682Ed9DF342262512DF3FfEf793Be9600',
        erc1155Factory: '0xc1abDEe65B137527E56B55dfB0F46a910f70d932',
        nativeFactory: '0x87E2677be1fC415FEEf76F54ed2f77960B8cd798',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmQbhbTU9YCeajmXZa84pNGv5HC1HesVmPHGaNLMfPdA2C',
      },
    },
  },
  {
    chainId: 5,
    name: 'Goerli',
    isTestnet: true,
    rpcAddress: `${globalConfig.alchemy.goerli.rpc}/${globalConfig.alchemy.goerli.key}`,
    network: {
      token: {
        wrappedAddress: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    stablecoinAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    marketplace: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmbbtD91BVHPmLzDvy7Uqv7KSLHX8jQTfnZwMHAjzKiDcN',
    },
    box: {
      contract: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmUfZuBCHmdtNQg59Mv2yyerr4XuZPF45uAArU9HQDdLqb',
    },
    fractionalizer: {
      contractFixedPrice: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      contractAuction: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmbupJz1HWzUiHw9kpWEy6Te63ExyXL5zSu9PKoFE2AUad',
    },
    crowdpad: {
      contract: '0x1e95B705Dbbb3E1128445aFc06D9dA401552FDCb',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmVgdCyLe9Zifgy3xZwdVXzvMA2dQnqMxHqaSjT3kpzwcC',
    },
    buyFloor: {
      contract: '0xd01d6903f1E06DB4E869d3eD585A7458db143387',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmYtHXuFGQ151VTfi21gjmhBMAnmkKngzzy8awxYKbxnp7',
    },
    fractionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmY75dFUNYxWrHk7WENFPPpovt528vRDLW4kVh5ETNTk4N',
    },
    trendingItems: [],
    rockpool: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmcCdhq4ADYQApYW1YcaYv5u5HoPwNxxNGcihFFLuM466y',
    },
    openseaConfig: {
      assetUrl: 'https://testnets.opensea.io/assets',
    },
    hub: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmVageVec195bPiRP5dJ5TWy6XwGCMR6LyumL9DWf9GBz8',
      contract: {
        erc721Factory: '0x90c335dA5778c9cB917A3cF62Ee0C0138699745f',
        erc20Factory: '0x45d28CD682Ed9DF342262512DF3FfEf793Be9600',
        erc1155Factory: '0xc1abDEe65B137527E56B55dfB0F46a910f70d932',
        nativeFactory: '0x87E2677be1fC415FEEf76F54ed2f77960B8cd798',
      },
    },
    topCollectionsFirebaseKey: 'goerli-top-collections',
    reservoir: {
      apiUrl: 'https://api-goerli.reservoir.tools',
    },
    alchemyApiUrl: `${globalConfig.alchemy.goerli.rpc}/${globalConfig.alchemy.goerli.key}`,
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmatGwDRMMwbvSVWUNWkekoEqAypqjHctsJ7SrtkFtgiJb',
      },
    },
  },
  {
    chainId: 56,
    isTestnet: false,
    name: 'Binance Smart Chain',
    rpcAddress: 'https://bsc-dataseed.binance.org',
    network: {
      token: {
        wrappedAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'BNB',
      },
    },
    stablecoinAddress: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    trendingItems: [],
    fractionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmRtxqsMHKMbZhnqddMK9Toi5VtYnXCKs9ei4VTHvRnyxk',
    },
    fractionalizer: {
      contractFixedPrice: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      contractAuction: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmS3UnSnFbvfM1VQckFDWXwGnyT5Znzd7NSjMcSxco9q8B',
    },
    crowdpad: {
      contract: '0x1e95B705Dbbb3E1128445aFc06D9dA401552FDCb',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmYCZWRi86i1oukbEUvwdXgGKLtAKF1hZz89xKsnrhNzHC',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    marketplace: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmRvHmp2MnnwwKxKBcQihYsjp48E9QKz9y7TxVnn5kRzjU',
    },
    box: {
      contract: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmZUqKyQn4aNo8Xf4c4ywVQvwgUs5CLN3tjuQpC79WcJK3',
    },
    exchange: {
      url: 'https://api.1inch.exchange/v4.0/56',
      slippage: 0.01,
      protocols: [
        { name: 'BSC_BI_SWAP', url: '' },
        { name: 'BSC_ONE_INCH_LP', url: '' },
        { name: 'BSC_ONE_INCH_LIMIT_ORDER', url: '' },
        { name: 'BSC_ONE_INCH_LIMIT_ORDER_V2', url: '' },
        { name: 'PANCAKESWAP_V2', url: '' },
        { name: 'PANCAKESWAP', url: '' },
      ],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    sweepAndFlip: {
      amm: {
        theGraph: 'https://api.studio.thegraph.com/query/93076/sweep-n-flip-amm/version/latest',
      },
    },
  },
  {
    chainId: 97,
    isTestnet: true,
    name: 'Binance Smart Chain Testnet',
    rpcAddress: 'https://data-seed-prebsc-1-s1.binance.org:8545',
    network: {
      token: {
        wrappedAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'BNB',
      },
    },
    stablecoinAddress: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    trendingItems: [],
    fractionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmRUFZ76FGrEYBTyTgapwLu6WadhhSg95nd8vuHUz4Lq6N',
    },
    fractionalizer: {
      contractFixedPrice: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      contractAuction: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmNVF1ffCdL4oPSDkgTygACrT2Emdfcozh9wNrPBka4Zue',
    },
    crowdpad: {
      contract: '0x1e95B705Dbbb3E1128445aFc06D9dA401552FDCb',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmfVcgbrnjzFGsuY1xTcKi554zjacT62d7PCXNWwSiUfjT',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    marketplace: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmeVow1PTVD2CTwduJDoL2VtieWBsTLf6SQcc3BiRqRL9P',
    },
    box: {
      contract: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmccM4EjGYSFnBvHkCY4bzzNAjpJQE9jN4Jsj2DaBZw13C',
    },
    exchange: {
      url: 'https://api.1inch.exchange/v4.0/56',
      slippage: 0.01,
      protocols: [
        { name: 'BSC_BI_SWAP', url: '' },
        { name: 'BSC_ONE_INCH_LP', url: '' },
        { name: 'BSC_ONE_INCH_LIMIT_ORDER', url: '' },
        { name: 'BSC_ONE_INCH_LIMIT_ORDER_V2', url: '' },
        { name: 'PANCAKESWAP_V2', url: '' },
        { name: 'PANCAKESWAP', url: '' },
      ],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
  },
  {
    chainId: 137,
    isTestnet: false,
    name: 'Polygon',
    rpcAddress: `${globalConfig.alchemy.polygon.rpc}/${globalConfig.alchemy.polygon.key}`,
    network: {
      token: {
        wrappedAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'MATIC',
      },
    },
    stablecoinAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    trendingItems: [],
    fractionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmNbLpHSs1tgWqayG1jHwFVbnywQc51mqPSnr9SqP8PVBS',
    },
    fractionalizer: {
      contractFixedPrice: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      contractAuction: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmVqLEUe5FwK1L2sx25qMCffXLQWfvejFBx9NnCKU9ZuPM',
    },
    crowdpad: {
      contract: '0x1e95B705Dbbb3E1128445aFc06D9dA401552FDCb',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmRAjiNSKrbsMNraWvoohqEMj1LrzXyzJuzLj7WU86kmTd',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    marketplace: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmaiM6aa4uHnado2sKr8mBNiCKP2Akn2VUUi1wuHLDF7Ez',
    },
    box: {
      contract: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmXKEssWZDbeueoLNqhfhG9RjgsQPmtfA4sHUr5a1rjYWr',
    },
    exchange: {
      url: 'https://api.1inch.exchange/v4.0/137',
      slippage: 0.01,
      protocols: [
        { name: 'POLYGON_BALANCER_V2', url: '' },
        { name: 'POLYGON_ONE_INCH_LIMIT_ORDER', url: '' },
        { name: 'POLYGON_ONE_INCH_LIMIT_ORDER_V2', url: '' },
        { name: 'ONESWAP', url: '' },
        { name: 'FIREBIRD_FINANCE', url: '' },
        { name: 'POLYGON_UNISWAP_V3', url: '' },
      ],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    reservoir: {
      apiUrl: 'https://api-polygon.reservoir.tools',
    },
    alchemyApiUrl: `${globalConfig.alchemy.polygon.rpc}/${globalConfig.alchemy.polygon.key}`,
    hub: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmWQqkzfETWSdEDukHmjoUB69cjnAZPksdMaKDN88fQ15F',
      contract: {
        nativeFactory: '0x87E2677be1fC415FEEf76F54ed2f77960B8cd798',
        erc20Factory: '0x45d28CD682Ed9DF342262512DF3FfEf793Be9600',
        erc721Factory: '0x90c335dA5778c9cB917A3cF62Ee0C0138699745f',
        erc1155Factory: '0xc1abDEe65B137527E56B55dfB0F46a910f70d932',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmbJnH4cLPuX5HftccJQdQ7QY9ehuT5tAd6BJKDZBCHCKh',
      },
    },
  },
  {
    chainId: 80001,
    isTestnet: true,
    name: 'Polygon Testnet',
    rpcAddress: `${globalConfig.alchemy.mumbai.rpc}/${globalConfig.alchemy.mumbai.key}`,
    network: {
      token: {
        wrappedAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'MATIC',
      },
    },
    stablecoinAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    trendingItems: [],
    fractionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmUzsCCHu5g8f9N18PGdZJnPJHMnF5JefH4vJ5WBc1uv3R',
    },
    fractionalizer: {
      contractFixedPrice: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      contractAuction: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmWiYpeLgtn7qdTZZCpdHj16Q9XmLi2Ub1tNXiCG4jFTXW',
    },
    crowdpad: {
      contract: '0x1e95B705Dbbb3E1128445aFc06D9dA401552FDCb',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmTLWN4dZdtBQ4RMnUvmxEPSx5B88dJgVW6jeZMnFKWEEN',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    marketplace: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmWC9ik5VmwZdvRpvq3v8cY5715aANPEiGMcHEjXtTUdLk',
    },
    box: {
      contract: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmUmANHKgjTJMwcKxfq963bQQBtxm4nJ8wpXxmGKC76zyS',
    },
    exchange: {
      url: 'https://api.1inch.exchange/v4.0/137',
      slippage: 0.01,
      protocols: [
        { name: 'POLYGON_BALANCER_V2', url: '' },
        { name: 'POLYGON_ONE_INCH_LIMIT_ORDER', url: '' },
        { name: 'POLYGON_ONE_INCH_LIMIT_ORDER_V2', url: '' },
        { name: 'ONESWAP', url: '' },
        { name: 'FIREBIRD_FINANCE', url: '' },
        { name: 'POLYGON_UNISWAP_V3', url: '' },
      ],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    alchemyApiUrl: `${globalConfig.alchemy.mumbai.rpc}/${globalConfig.alchemy.mumbai.key}`,
    hub: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmZJsp7N8iKb4PhjxLajEnJtTvZAvYGZuNyaG5LBh4cyyv',
      contract: {
        erc721Factory: '0x205462897551253a75eBb27DF8Eaf5597a02732a',
        erc20Factory: '0xBAEe91C450656AE0784Fd33ef594527CC0e88894',
        erc1155Factory: '0xeDB80739C45b047E530B0aa4E57E8E5B7D15Beaa',
        nativeFactory: '0x852553ba58Dff6DFeB24833FaEc469619256E4d4',
      },
    },
  },
  {
    chainId: 42161,
    name: 'Arbitrum',
    isTestnet: false,
    rpcAddress: `${globalConfig.alchemy.arbitrum.rpc}/${globalConfig.alchemy.arbitrum.key}`,
    network: {
      token: {
        wrappedAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    stablecoinAddress: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    marketplace: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmaZWACCH63FenSuDkiTLSRsBuGh3bZgvALVMRtpPHMEM4',
    },
    box: {
      contract: '0xFc44f66D5D689cD9108c6577533E9572f53a50Bc',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmXBX2oBntKD9oF2fiR4EcjCctPdnGH7zL1bhC27sLauCS',
    },
    fractionalizer: {
      contractFixedPrice: '0x8279BE8f740DBeDB05C0Ce165447E8bc1457a137',
      contractAuction: '0x5EF37b60C374634Ff917BaafECB515Bf1482cAc3',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmVPuw6zG1dgmm653NLtBXFQQyjdLnZJybJ9GaisBhxuHk',
    },
    fractionalizerV1: {
      contract: '0x727638740980aA0aA0B346d02dd91120Eaac75ed',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmbyGktJeAKb1UjtYkrdzE8fswMZCAGa8xRM3akSahYqvx',
    },
    trendingItems: [
      '0x1e95b705dbbb3e1128445afc06d9da401552fdcb#16',
      '0x4fc1d1118b2754366a2e53c486139a14059d2e75',
      '0xa6eb2b9a95b4c217867814f28f42cc345643f9c6',
      '0xf90ba84adc07416d4bd56edae16a5c21b5e5f08b',
    ],
    crowdpad: {
      contract: '0x1e95B705Dbbb3E1128445aFc06D9dA401552FDCb',
      theGraph:
        'https://api.thegraph.com/subgraphs/id/Qmb6yxu8eRDfikmgmzso9s3WKCrBYxs1KCvNkjUPY9wYkj',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: 'https://api.1inch.exchange/v4.0/1',
      slippage: 0.01,
      protocols: [
        { name: 'UNISWAP_V1', url: '' },
        { name: 'UNISWAP_V2', url: '' },
        { name: 'BALANCER', url: '' },
        { name: 'ZRX', url: '' },
        { name: 'ONE_INCH_LIMIT_ORDER', url: '' },
      ],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmWnZpfoTFk2dyuGU4BRqxtxeSVJ4Ny9R5spoeH8daMq2d',
    },
    openseaConfig: {
      assetUrl: 'https://opensea.io/assets',
    },
    topCollectionsFirebaseKey: 'mainnet-top-collections',
    reservoir: {
      apiUrl: 'https://api-arbitrum.reservoir.tools',
    },
    alchemyApiUrl: `${globalConfig.alchemy.ethereum.rpc}/${globalConfig.alchemy.ethereum.key}`,
    hub: {
      theGraph:
        'https://api.thegraph.com/subgraphs/id/QmbEyed8kaShPrbyfSpkAAoG8UmyAmZxUp1Ux8rLGv73jK',
      contract: {
        erc721Factory: '0x90c335dA5778c9cB917A3cF62Ee0C0138699745f',
        erc20Factory: '0x45d28CD682Ed9DF342262512DF3FfEf793Be9600',
        erc1155Factory: '0xc1abDEe65B137527E56B55dfB0F46a910f70d932',
        nativeFactory: '0x87E2677be1fC415FEEf76F54ed2f77960B8cd798',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmRmo1WokR6DawFYsM4CGASPGKzseBUuxEpaTMLHtQ5RqY',
      },
    },
  },
  {
    chainId: 43114,
    name: 'Avalanche Mainnet',
    isTestnet: false,
    rpcAddress: 'https://rpc.ankr.com/avalanche',
    network: {
      token: {
        wrappedAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'AVAX',
      },
    },
    stablecoinAddress: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: '',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmUx9N8xcXmWkaxSrXN7Kf4EDVuWuPM3ZQx9HDfFR2d8xv',
      },
    },
  },
  {
    chainId: 8453,
    name: 'Base Mainnet',
    isTestnet: false,
    rpcAddress: 'https://mainnet.base.org',
    network: {
      token: {
        wrappedAddress: '0x4200000000000000000000000000000000000006',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    stablecoinAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: '',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmQ28JfS4jqSdqijeXZarQjnjc6rhpXrNrrz6UMah3NAnk',
      },
    },
  },
  {
    chainId: 59144,
    name: 'Linea',
    isTestnet: false,
    rpcAddress: 'https://rpc.linea.build',
    network: {
      token: {
        wrappedAddress: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    stablecoinAddress: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: '',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://graph-query.linea.build/subgraphs/id/QmW1GcAFPsBD8vjjtgbTs5xvtq76oa5XvyTFAFNegBv6cy',
      },
    },
  },
  {
    chainId: 10,
    name: 'Optimism',
    isTestnet: false,
    rpcAddress: 'https://opt-mainnet.g.alchemy.com/v2/8ZIowsWeIkyFAYsIyIXa8cfLhPwAPczS',
    network: {
      token: {
        wrappedAddress: '0x4200000000000000000000000000000000000006',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    stablecoinAddress: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: '',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmeNdCFKzNTac7FSFGMxbTvkevZwLanwMcGGeidoWqySCp',
      },
    },
  },
  {
    chainId: 81457,
    name: 'Blast',
    isTestnet: false,
    rpcAddress: 'https://blast.blockpi.network/v1/rpc/public"',
    network: {
      token: {
        wrappedAddress: '0x4300000000000000000000000000000000000004',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    stablecoinAddress: '0x4300000000000000000000000000000000000003',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: '',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/Qmc6eQvp3yFnfLxQdLEYj6mLmGEBaBvMFHYi99xBfBieEx',
      },
    },
  },
  {
    name: 'Mode',
    chainId: 34443,
    rpcAddress: 'https://mainnet.mode.network',
    isTestnet: false,
    network: {
      token: {
        address: '0x0000000000000000000000000000000000000000',
        wrappedAddress: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        symbol: 'ETH',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/QmR8XG3qeJeSAau5rLc2CpomhTRCN28MQXxHFnTdNr9LbX',
      },
    },
    stablecoinAddress: '0x4300000000000000000000000000000000000003',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: '',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
  },
  {
    name: 'Moonbeam',
    chainId: 1284,
    rpcAddress: 'https://rpc.api.moonbeam.network',
    isTestnet: false,
    network: {
      token: {
        address: '0x0000000000000000000000000000000000000000',
        wrappedAddress: '0xacc15dc74880c9944775448304b263d191c6077f',
        decimals: 18,
        symbol: 'GLMR',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.thegraph.com/subgraphs/id/Qmdcz8JZwkuQcMqG2CJgAE1Y4njKxpfUFzk6CWXmUquHFR',
      },
    },
    stablecoinAddress: '0xacc15dc74880c9944775448304b263d191c6077f',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: '',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
  },
  {
    name: 'Berachain',
    chainId: 80084,
    rpcAddress: 'https://bartio.rpc.berachain.com',
    isTestnet: true,
    network: {
      token: {
        address: '0x0000000000000000000000000000000000000000',
        wrappedAddress: '0x7507c1dc16935b82698e4c63f2746a2fcf994df8',
        decimals: 18,
        symbol: 'BERA',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.goldsky.com/api/public/project_cm08eswaacp6901wwdaxnfyjq/subgraphs/nftfy-beratest/v1.0.13-uni/gn',
      },
    },
    stablecoinAddress: '0x05d0dd5135e3ef3ade32a9ef9cb06e8d37a6795d',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: 'https://api-berachain-testnet.reservoir.tools',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
  },
  {
    name: 'Bitfinity Testnet',
    chainId: 355113,
    rpcAddress: 'https://testnet.bitfinity.network',
    isTestnet: true,
    network: {
      token: {
        address: '0x0000000000000000000000000000000000000000',
        wrappedAddress: '0x7938ACd297d53bD743c3926E3C24e7262C18AEc3',
        decimals: 18,
        symbol: 'BFT',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://242ed9ab-9df0-4458-98fd-529803ec78a5.squids.live/sweepnflip-amm-squid@v1/api/graphql',
        useSubsquid: true,
      },
    },
    stablecoinAddress: '0xbd9A5c1d9fBbBEC84633ec9Cb046C01fB79809f2',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: 'https://api-bitfinity-testnet.reservoir.tools',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
  },
  {
    name: 'StratoVM',
    chainId: 93747,
    rpcAddress: 'https://rpc.stratovm.io',
    isTestnet: true,
    network: {
      token: {
        address: '0x0000000000000000000000000000000000000000',
        wrappedAddress: '0xC87De04e2EC1F4282dFF2933A2D58199f688fC3d',
        decimals: 18,
        symbol: 'SVM',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://736998a3-c1a8-4216-ab1f-90b065e35097.squids.live/sweepnflip-amm-subsquid@v1/api/graphql',
        useSubsquid: true,
      },
    },
    stablecoinAddress: '0xC87De04e2EC1F4282dFF2933A2D58199f688fC3d',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: 'https://api-stratovm-testnet.reservoir.tools',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
  },
  {
    name: 'BitLayer',
    chainId: 200901,
    rpcAddress: 'https://rpc.bitlayer.org',
    isTestnet: true,
    network: {
      token: {
        address: '0x0E4cF4Affdb72b39Ea91fA726D291781cBd020bF',
        wrappedAddress: '0xfF204e2681A6fA0e2C3FaDe68a1B28fb90E4Fc5F',
        decimals: 18,
        symbol: 'BTR',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph: '',
        useSubsquid: true,
      },
    },
    stablecoinAddress: '0xC87De04e2EC1F4282dFF2933A2D58199f688fC3d',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: 'https://api-bitlayer.reservoir.tools',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
  },
  {
    name: 'Ape Chain',
    chainId: 33139,
    rpcAddress: 'https://rpc.apechain.com/http',
    isTestnet: true,
    network: {
      token: {
        address: '0x0000000000000000000000000000000000000000',
        wrappedAddress: '0x48b62137EdfA95a428D35C09E44256a739F6B557',
        decimals: 18,
        symbol: 'APE',
      },
    },
    sweepAndFlip: {
      amm: {
        theGraph:
          'https://api.goldsky.com/api/public/project_cm7280omkluph010hczhc146w/subgraphs/snf-amm-apechain/v1.0.13-uni/gn',
        useSubsquid: false,
      },
    },
    stablecoinAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    marketplace: {
      theGraph: '',
    },
    box: {
      contract: '',
      theGraph: '',
    },
    fractionalizer: {
      contractFixedPrice: '',
      contractAuction: '',
      theGraph: '',
    },
    fractionalizerV1: {
      contract: '',
      theGraph: '',
    },
    trendingItems: [],
    crowdpad: {
      contract: '',
      theGraph: '',
    },
    buyFloor: {
      contract: '',
      theGraph: '',
    },
    exchange: {
      url: '',
      slippage: 0.01,
      protocols: [],
      networkTokenAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      name: SupportedExchanges.oneInch,
    },
    rockpool: {
      theGraph: '',
    },
    openseaConfig: {
      assetUrl: '',
    },
    topCollectionsFirebaseKey: '',
    reservoir: {
      apiUrl: 'https://api-apechain.reservoir.tools',
    },
    alchemyApiUrl: '',
    hub: {
      theGraph: '',
      contract: {
        erc721Factory: '',
        erc20Factory: '',
        erc1155Factory: '',
        nativeFactory: '',
      },
    },
  },
]
export const chainConfig = (id: number): ChainConfig => {
  const foundConfig = chainsConfig.find((chain) => chain.chainId === id)

  if (!foundConfig) {
    const logger = new Logger('ChainConfig')
    logger.error(`Chain config not found for ${id}`)
    throw new Error(`Chain config not found for ${id}`)
  }

  return foundConfig
}

export const mainChains = (): ChainConfig[] => {
  return chainsConfig.filter((chain) => chain.isTestnet === false)
}

export interface ChainTokenConfig {
  wrappedAddress: string
  symbol: string
  address: string
  decimals: number
}

export interface ChainNetworkConfig {
  token: ChainTokenConfig
}

export interface ChainAmmConfig {
  useSubsquid?: boolean
  theGraph: string
}

export interface ChainSweepAndFlipConfig {
  amm: ChainAmmConfig
}

const logger = new Logger('ChainConfig')

// Configurações padrão para diferentes chains
const chainConfigs: Record<number, Partial<ChainConfig>> = {
  // Ethereum Mainnet
  1: {
    network: {
      token: {
        wrappedAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-mainnet',
      },
    },
  },
  // Arbitrum
  42161: {
    network: {
      token: {
        wrappedAddress: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-arbitrum',
      },
    },
  },
  // Optimism
  10: {
    network: {
      token: {
        wrappedAddress: '0x4200000000000000000000000000000000000006',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-optimism',
      },
    },
  },
  // Polygon
  137: {
    network: {
      token: {
        wrappedAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        symbol: 'MATIC',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: true,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-polygon',
      },
    },
  },
  // Base
  8453: {
    network: {
      token: {
        wrappedAddress: '0x4200000000000000000000000000000000000006',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-base',
      },
    },
  },
  // Mode
  34443: {
    network: {
      token: {
        wrappedAddress: '0x4200000000000000000000000000000000000006',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-mode',
      },
    },
  },
  // Avalanche
  43114: {
    network: {
      token: {
        wrappedAddress: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
        symbol: 'AVAX',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-avalanche',
      },
    },
  },
  // Blast
  81457: {
    network: {
      token: {
        wrappedAddress: '0x4300000000000000000000000000000000000004',
        symbol: 'ETH',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-blast',
      },
    },
  },
  // Moonbeam
  1284: {
    network: {
      token: {
        wrappedAddress: '0xAcc15dC74880C9944775448304B263D191c6077F',
        symbol: 'GLMR',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-moonbeam',
      },
    },
  },
  // ApeChain
  33139: {
    network: {
      token: {
        wrappedAddress: '0xae26B8671961b88Ae4CeB8eF9b0aB0CA5C92f8D0',
        symbol: 'APE',
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
      },
    },
    sweepAndFlip: {
      amm: {
        useSubsquid: false,
        theGraph: 'https://api.thegraph.com/subgraphs/name/vince0656/snf-amm-apechain',
      },
    },
  },
}

// Renomear a segunda implementação de chainConfig para getChainConfigRecord para evitar duplicidade
export const getChainConfigRecord = (chainId: number): Partial<ChainConfig> => {
  const config = chainConfigs[chainId]

  if (!config) {
    logger.warn(`Chain configuration not found for chainId ${chainId}, using default (Ethereum)`)
    return chainConfigs[1] // Ethereum como padrão
  }

  return config
}
