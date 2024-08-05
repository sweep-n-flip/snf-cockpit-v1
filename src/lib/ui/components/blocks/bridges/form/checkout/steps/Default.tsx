import { BridgeStep } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { ERC721Tokens, ERC721Collections } from '@/lib/services/api/entities/ERC721/types'
import { Address } from 'viem'
import { Steps } from '@/lib/ui/components/blocks/bridges/form/checkout'
import { filter, find, map } from 'lodash'
import { Chains } from '@/lib/payloadcms/types/payload-types'

export type DefaultProps = {
  collectionAddress: Address
  tokensIds: (Address | string | number)[]
  currentStep: number
  isFinished?: boolean
  tokens: ERC721Tokens
  collections: ERC721Collections
  chainIn?: Chains
  chainOut?: Chains
  transactionHash?: string
}

export const Default = ({
  currentStep,
  isFinished,
  tokens,
  collections,
  collectionAddress,
  tokensIds,
  chainIn,
  chainOut,
  transactionHash,
}: DefaultProps) => {
  const selectedCollection = find(
    collections,
    (collection) => collection.address === collectionAddress,
  )

  const selectedTokens = filter(
    map(tokensIds, (tokenId) => find(tokens, { tokenId })),
    (token) => token,
  ) as ERC721Tokens

  return (
    <div className="p-4">
      {currentStep === BridgeStep.Details ? (
        <Steps.Review
          selectedTokens={selectedTokens}
          selectedCollection={selectedCollection}
          collectionAddress={collectionAddress}
          tokensIds={tokensIds}
          chainIn={chainIn}
          chainOut={chainOut}
        />
      ) : (
        <Steps.Confirmations
          transactionHash={transactionHash}
          selectedCollection={selectedCollection}
          currentStep={currentStep}
          isFinished={isFinished}
          chainIn={chainIn}
          chainOut={chainOut}
        />
      )}
    </div>
  )
}

export default Default
