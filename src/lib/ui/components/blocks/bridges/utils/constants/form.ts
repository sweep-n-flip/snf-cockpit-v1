import { TokenType, FormDataType } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { Address } from 'viem'

export const DEFAULT_FORM_STATE: FormDataType = {
  [TokenType.TokenIn]: {
    chain: {
      chainId: 0,
      name: '',
      symbol: '',
    },
    collectionAddress: '' as Address,
    tokenIds: [] as (Address | string | number)[],
  },
  [TokenType.TokenOut]: {
    chain: {
      chainId: 0,
      name: '',
      symbol: '',
    },
    collectionAddress: '' as Address,
    tokenIds: [] as (Address | string | number)[],
  },
}
