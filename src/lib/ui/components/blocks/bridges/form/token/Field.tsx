'use client'

import { Card } from '@/lib/ui/components'
import {
  ChooseChainId,
  InputQty,
  ChooseTokenIds,
  ChooseCollection,
  Rangebar,
  AssetValues,
} from '@/lib/ui/components/blocks/bridges/form/token'
import { ChooseChainProps } from '@/lib/ui/components/blocks/bridges/form/token/ChooseChain'
import { TokenType } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { useFormContext } from 'react-hook-form'
import { COLLECTION_ADDRESS_IN } from '@/lib/ui/components/blocks/bridges/utils/constants/fields'
import gt from 'lodash/gt'
import {
  Collection,
  Token,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'

export type FieldProps = {
  tokenType: TokenType
  chains: ChooseChainProps['chains']
  collections: Collection[]
  tokens: Token[]
  loading?: boolean
}

export const Field = ({ tokenType, chains, collections, tokens, loading }: FieldProps) => {
  const { watch } = useFormContext()

  const collectionAddressInValue = watch(COLLECTION_ADDRESS_IN, '')

  return (
    <Card.Default variant="primary" className="flex flex-col gap-2">
      <ChooseChainId tokenType={tokenType} chains={chains} />
      <div className="flex justify-between gap-2">
        <div className="flex flex-col justify-center">
          <InputQty tokenType={tokenType} />
        </div>
        <div className="flex flex-none gap-4">
          {!!collectionAddressInValue && tokenType === TokenType.TokenIn && (
            <ChooseTokenIds tokens={tokens} tokenType={tokenType} />
          )}
          <ChooseCollection
            disabled={tokenType === TokenType.TokenOut}
            tokenType={tokenType}
            collections={collections}
            loading={loading}
          />
        </div>
      </div>
      {tokenType === TokenType.TokenIn && gt(tokens.length, 0) && (
        <div className="flex flex-col space-y-6">
          <AssetValues tokens={tokens} />
          <Rangebar tokenType={tokenType} tokens={tokens} />
        </div>
      )}
    </Card.Default>
  )
}

export default Field
