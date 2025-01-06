import { BridgeStep } from '@/components/bridge/types/bridge'
import { Address } from 'viem'
import { Steps } from '@/components/bridge/form/checkout'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import { Collection } from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/ownership/types'

export type DefaultProps = {
  collectionAddress: Address
  tokensIds: (Address | string | number)[]
  currentStep: number
  isFinished?: boolean
  tokens: string[]
  selectedCollection: Collection | undefined
  chainIn?: Chains
  chainOut?: Chains
  transactionHash?: string
}

export const Default = ({
  currentStep,
  isFinished,
  tokens,
  selectedCollection,
  collectionAddress,
  tokensIds,
  chainIn,
  chainOut,
  transactionHash,
}: DefaultProps) => {
  const selectedTokens: string[] = tokens.filter((token) => tokensIds.includes(token))

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
