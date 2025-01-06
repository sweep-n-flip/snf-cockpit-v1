import { TokenType, FormDataType } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { Address } from 'viem'

export const DEFAULT_FORM_STATE: FormDataType = {
  [TokenType.TokenIn]: {
    chain: {
      id: '',
      slug: '',
      nativeCurrency: {
        address: '',
        name: '',
        symbol: '',
        decimals: 0,
      },
      custom: {
        logo: '',
      },
      updatedAt: '',
      createdAt: '',
      chainId: 0,
      name: '',
    },
    collectionAddress: '' as Address,
    tokenIds: [] as (Address | string | number)[],
  },
  [TokenType.TokenOut]: {
    chain: {
      id: '',
      slug: '',
      nativeCurrency: {
        address: '',
        name: '',
        symbol: '',
        decimals: 0,
      },
      custom: {
        logo: '',
      },
      updatedAt: '',
      createdAt: '',
      chainId: 0,
      name: '',
    },
    collectionAddress: '' as Address,
    tokenIds: [] as (Address | string | number)[],
  },
}
