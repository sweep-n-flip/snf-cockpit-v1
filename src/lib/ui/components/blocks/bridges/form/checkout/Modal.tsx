'use client'

import { Default } from '@/lib/ui/components/modal'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { TokenType, BridgeStep } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { useWallet } from '@/lib/web3'
import { useStep, useToggle } from 'usehooks-ts'
import { Address } from 'viem'
import { DEFAULT_FORM_STATE } from '@/lib/ui/components/blocks/bridges/utils/constants/form'
import { TOTAL_STEPS } from '@/lib/ui/components/blocks/bridges/utils/constants/checkout'
import { Steps } from '@/lib/ui/components/blocks/bridges/form/checkout'

import classNames from 'classnames'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import useBridge from '@/lib/ui/components/blocks/bridges/hooks/useBridge'
import { useErc721IsApprovedForAll } from '@/lib/ui/components/blocks/bridges/hooks/useErc721IsApprovedForAll'
import useErc721SetApprovalForAll from '@/lib/ui/components/blocks/bridges/hooks/useErc721SetApprovalForAll'
import {
  Collection,
  Token,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/ERC721/wallet/types'
import { useContracts } from '@/lib/services/rest/hooks/useContracts'

export type BridgeData = {
  [key in TokenType]: {
    collectionAddress: Address
    tokenIds: (Address | string | number)[]
    chain: Chains
  }
}

export type ModalChildrenRenderProps = {
  openBridge: (data: BridgeData) => void
}

export type ModalProps = {
  children: (props: ModalChildrenRenderProps) => ReactNode
  onCloseAfterBridge?: () => void
  tokens: string[]
  selectedCollection: Collection | undefined
}

export const Modal = ({ children, onCloseAfterBridge, tokens, selectedCollection }: ModalProps) => {
  const { address } = useWallet()
  const [isModalOpen, , setIsModalOpen] = useToggle()

  const [formData, setFormData] = useState<BridgeData>(DEFAULT_FORM_STATE)

  const tokenInChain = useMemo(() => formData[TokenType.TokenIn].chain, [formData])
  const tokenOutChain = useMemo(() => formData[TokenType.TokenOut].chain, [formData])

  const { contracts: bridgeContracts } = useContracts({
    chainId: tokenInChain.chainId,
    type: 'bridge',
  })

  const bridgeAddress = useMemo(() => {
    return bridgeContracts?.[0].address as Address | undefined
  }, [bridgeContracts])
  const bridgeAbi = useMemo(() => bridgeContracts?.[0].abi as string | undefined, [bridgeContracts])

  const {
    bridge,
    loading: isBridgeLoading,
    isBridgeDone,
    transactionHash,
  } = useBridge({
    collectionAddress: formData[TokenType.TokenIn].collectionAddress,
    tokenIds: formData[TokenType.TokenIn].tokenIds,
    bridgeAddress,
    bridgeABI: bridgeAbi && JSON.parse(bridgeAbi),
    chainId: tokenInChain.chainId,
    toChainId: tokenOutChain.chainId,
  })

  const {
    isApprovedForAll,
    loading: isApprovedForAllLoading,
    refetch: refetchIsApprovedForAll,
  } = useErc721IsApprovedForAll({
    operator: bridgeAddress,
    contractAddress: formData[TokenType.TokenIn].collectionAddress,
    owner: address,
    chainId: tokenInChain.chainId,
  })

  const {
    approve,
    loading: setIsApprovedForAllLoading,
    isApprovalSet,
  } = useErc721SetApprovalForAll({
    collectionAddress: formData[TokenType.TokenIn].collectionAddress,
    operator: bridgeAddress,
    chainId: tokenInChain.chainId,
  })

  /// steps handler
  const [currentStep, helpers] = useStep(TOTAL_STEPS)
  const { goToNextStep, reset: resetSteps, goToPrevStep, setStep } = helpers

  const resetState = () => {
    resetSteps()
    setFormData(DEFAULT_FORM_STATE)
  }

  const handleOpenBridge = (data: BridgeData) => {
    resetState()
    setIsModalOpen(true)
    setFormData(data)
  }

  const handleCloseBridge = () => {
    setIsModalOpen(false)
    resetState()
    if (currentStep === BridgeStep.Success) {
      onCloseAfterBridge?.()
    }
  }

  const handleStepBack = () => {
    const isSkipApproval = currentStep === BridgeStep.Bridge && isApprovedForAll

    if (isSkipApproval) {
      setStep(BridgeStep.Details)
      return
    }

    goToPrevStep()
  }

  const handleConfirm = async () => {
    try {
      if (currentStep === BridgeStep.Details) {
        goToNextStep()
      } else if (currentStep === BridgeStep.Approve) {
        await approve()
      } else if (currentStep === BridgeStep.Bridge) {
        await bridge()
      } else {
        /// bridge
        handleCloseBridge()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const isCurrentStepDisabled = () => {
    if (currentStep === BridgeStep.Details) {
      return false
    } else if (currentStep === BridgeStep.Approve) {
      return isApprovedForAllLoading || setIsApprovedForAllLoading
    } else if (currentStep === BridgeStep.Bridge) {
      return isBridgeLoading || isTransactionPending
    }
  }

  const isCurrentStepLoading = () => {
    if (currentStep === BridgeStep.Details) {
      return false
    } else if (currentStep === BridgeStep.Approve) {
      return isApprovedForAllLoading || setIsApprovedForAllLoading
    } else if (currentStep === BridgeStep.Bridge) {
      return isBridgeLoading || isTransactionPending
    }
  }

  useEffect(() => {
    const alreadyApprovedForAll = isApprovedForAll && currentStep === BridgeStep.Approve

    if (alreadyApprovedForAll) {
      goToNextStep()
    }
  }, [goToNextStep, currentStep, isApprovedForAll])

  useEffect(() => {
    const isApprovedForAllTransactionConfirmed = currentStep === BridgeStep.Approve && isApprovalSet

    if (isApprovedForAllTransactionConfirmed) {
      refetchIsApprovedForAll()
    }
  }, [isApprovalSet, currentStep, refetchIsApprovedForAll])

  useEffect(() => {
    const isBridgeTransactionConfirmed = isBridgeDone && currentStep === BridgeStep.Bridge

    if (isBridgeTransactionConfirmed) {
      goToNextStep()
    }
  }, [goToNextStep, currentStep, isBridgeDone])

  const isTransactionPending = isBridgeLoading

  return (
    <>
      {children({ openBridge: handleOpenBridge })}
      {isModalOpen && formData && (
        <Default
          className={classNames([
            'mx-auto w-full',
            currentStep !== BridgeStep.Details ? 'lg:w-[32rem]' : 'lg:w-[56rem]',
          ])}
          title="Bridge"
          isOpen={isModalOpen}
          onClose={handleCloseBridge}
          closable={
            !setIsApprovedForAllLoading &&
            !isBridgeLoading &&
            !isApprovedForAllLoading &&
            isApprovalSet
          }
        >
          <Steps.Default
            chainIn={tokenInChain}
            chainOut={tokenOutChain}
            tokens={tokens}
            selectedCollection={selectedCollection}
            collectionAddress={formData[TokenType.TokenIn].collectionAddress}
            tokensIds={formData[TokenType.TokenIn].tokenIds}
            currentStep={currentStep}
            isFinished={
              currentStep === BridgeStep.Success // TODO: check if bridge tx is done
            }
            transactionHash={transactionHash}
          />

          <div className="flex justify-end space-x-4 border-t border-zinc-200 p-4">
            {currentStep !== BridgeStep.Success && currentStep !== BridgeStep.Details && (
              <Steps.Back
                label={'Back'}
                onBack={handleStepBack}
                disabled={isCurrentStepDisabled()}
                loading={isCurrentStepLoading()}
              />
            )}

            <Steps.Action
              label={'Confirm'}
              onConfirm={handleConfirm}
              disabled={isCurrentStepDisabled()}
              loading={isCurrentStepLoading()}
            />
          </div>
        </Default>
      )}
    </>
  )
}

export default Modal
