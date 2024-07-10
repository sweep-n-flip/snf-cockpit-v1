import { TokenType, FormDataType } from '@/lib/bridge/types/bridge'
import { CHAIN_ID, COLLECTION_ADDRESS, TOKEN_IDS } from '@/lib/bridge/utils/constants/fields'

import { Address } from 'viem'

export const DEFAULT_FORM_STATE: FormDataType = {
  [TokenType.TokenIn]: {
    [CHAIN_ID]: 0,
    [COLLECTION_ADDRESS]: '' as Address,
    [TOKEN_IDS]: [],
  },
  [TokenType.TokenOut]: {
    [CHAIN_ID]: 0,
    [COLLECTION_ADDRESS]: '' as Address,
    [TOKEN_IDS]: [],
  },
}
