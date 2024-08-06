import { TokenType, FormDataType } from '@/lib/ui/components/blocks/bridges/types/bridge'
import {
  CHAIN_ID,
  COLLECTION_ADDRESS,
  TOKEN_IDS,
} from '@/lib/ui/components/blocks/bridges/utils/constants/fields'

import { Address } from 'viem'
import { Chains } from '@/lib/payloadcms/types/payload-types'

export const DEFAULT_FORM_STATE: FormDataType = {
  [TokenType.TokenIn]: {
    [CHAIN_ID]: 0,
    [COLLECTION_ADDRESS]: '' as Address,
    [TOKEN_IDS]: [] as (Address | string | number)[],
  },
  [TokenType.TokenOut]: {
    [CHAIN_ID]: 0,
    [COLLECTION_ADDRESS]: '' as Address,
    [TOKEN_IDS]: [] as (Address | string | number)[],
  },
}
