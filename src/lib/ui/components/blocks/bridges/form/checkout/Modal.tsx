'use client'

import { Default } from '@/lib/ui/components/modal'
import { useEffect, useMemo, useState } from 'react'
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
  openBridge: boolean
  bridgeData: BridgeData
  onCloseAfterBridge?: () => void
  tokens: Token[]
  collections: Collection[]
  bridgeAddress?: Address
}

export const Modal = ({
  openBridge,
  bridgeData,
  onCloseAfterBridge,
  tokens,
  collections,
  bridgeAddress,
}: ModalProps) => {
  const { address } = useWallet()
  const [isModalOpen, , setIsModalOpen] = useToggle()

  const [formData, setFormData] = useState<BridgeData>(DEFAULT_FORM_STATE)

  const tokenInChain = useMemo(() => formData[TokenType.TokenIn].chain, [formData])
  const tokenOutChain = useMemo(() => formData[TokenType.TokenOut].chain, [formData])

  const {
    bridge,
    loading: isBridgeLoading,
    isBridgeDone,
    transactionHash,
  } = useBridge({
    collectionAddress: formData[TokenType.TokenIn].collectionAddress,
    tokenIds: formData[TokenType.TokenIn].tokenIds,
    bridgeAddress,
    toChainId: formData[TokenType.TokenOut].chain.chainId,
  })

  const {
    isApprovedForAll,
    loading: getER721IsApprovedForAllLoading,
    refetch: refetchIsApprovedForAll,
  } = useErc721IsApprovedForAll({
    operator: bridgeAddress,
    contractAddress: formData[TokenType.TokenIn].collectionAddress,
    // TODO: add erc721 abi
    contractABI: '',
    owner: address,
  })

  const {
    approve,
    loading: isApproveLoading,
    isApprovalSet,
  } = useErc721SetApprovalForAll({
    collectionAddress: formData[TokenType.TokenIn].collectionAddress,
    operator: bridgeAddress,
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
    setFormData((prev) => ({ ...prev, ...data }))
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

  useEffect(() => {
    if (openBridge) {
      handleOpenBridge(bridgeData)
    }
  }, [openBridge, bridgeData, handleOpenBridge])

  const isTransactionPending = isBridgeLoading

  return (
    <>
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
            !isApproveLoading &&
            !isBridgeLoading &&
            !getER721IsApprovedForAllLoading &&
            isApprovalSet
          }
        >
          <Steps.Default
            chainIn={tokenInChain}
            chainOut={tokenOutChain}
            tokens={tokens}
            collections={collections}
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
                disabled={
                  isApproveLoading ||
                  getER721IsApprovedForAllLoading ||
                  isBridgeLoading ||
                  isTransactionPending
                }
                loading={getER721IsApprovedForAllLoading || isBridgeLoading || isTransactionPending}
              />
            )}

            <Steps.Action
              label={'Confirm'}
              onConfirm={handleConfirm}
              disabled={
                isApproveLoading ||
                getER721IsApprovedForAllLoading ||
                isBridgeLoading ||
                isTransactionPending
              }
              loading={
                isApproveLoading ||
                getER721IsApprovedForAllLoading ||
                isBridgeLoading ||
                isTransactionPending
              }
            />
          </div>
        </Default>
      )}
    </>
  )
}

export default Modal
