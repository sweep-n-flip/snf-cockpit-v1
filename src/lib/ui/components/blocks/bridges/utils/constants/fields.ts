import { TokenType } from '@/lib/ui/components/blocks/bridges/types/bridge'

export const CHAIN_ID = 'chain'

export const COLLECTION_ADDRESS = 'collectionAddress'

export const TOKEN_IDS = 'tokenIds'

export const CHAIN_ID_IN = `${TokenType.TokenIn}.${CHAIN_ID}`

export const COLLECTION_ADDRESS_IN = `${TokenType.TokenIn}.${COLLECTION_ADDRESS}`

export const TOKEN_IDS_IN = `${TokenType.TokenIn}.${TOKEN_IDS}`

export const CHAIN_ID_OUT = `${TokenType.TokenOut}.${CHAIN_ID}`

export const COLLECTION_ADDRESS_OUT = `${TokenType.TokenOut}.${COLLECTION_ADDRESS}`

export const TOKEN_IDS_OUT = `${TokenType.TokenOut}.${TOKEN_IDS}`
