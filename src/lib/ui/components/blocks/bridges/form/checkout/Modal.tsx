'use client'

import { Default } from '@/lib/ui/components/modal'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { TokenType, BridgeStep } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { useWallet } from '@/lib/web3'
import { useStep, useToggle } from 'usehooks-ts'
import { Address } from 'viem'
import { BridgeStatus } from '@/lib/services/api/entities/bridge/types'
import { DEFAULT_FORM_STATE } from '@/lib/ui/components/blocks/bridges/utils/constants/form'
import { TOTAL_STEPS } from '@/lib/ui/components/blocks/bridges/utils/constants/checkout'
import { Steps } from '@/lib/ui/components/blocks/bridges/form/checkout'

import { ERC721Tokens, ERC721Collections } from '@/lib/services/api/entities/ERC721/types'
import classNames from 'classnames'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import useBridge from '@/lib/ui/components/blocks/bridges/hooks/useBridge'
import { useErc721IsApprovedForAll } from '@/lib/ui/components/blocks/bridges/hooks/useErc721IsApprovedForAll'
import useErc721SetApprovalForAll from '@/lib/ui/components/blocks/bridges/hooks/useErc721SetApprovalForAll'

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
  tokens: ERC721Tokens
  collections: ERC721Collections
  bridgeAddress?: Address
}

export const Modal = ({
  children,
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

  const { isApprovedForAll, loading: getER721IsApprovedForAllLoading } = useErc721IsApprovedForAll({
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
    const isSkipApproval = currentStep === BridgeStep.Bridge && isBridgeDone

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
    const alreadyApprovedForAll = isBridgeDone && currentStep === BridgeStep.Approve

    if (alreadyApprovedForAll) {
      goToNextStep()
    }
  }, [goToNextStep, currentStep, isBridgeDone])

  useEffect(() => {
    const isApprovedForAllTransactionConfirmed = currentStep === BridgeStep.Approve && isApprovalSet

    if (isApprovedForAllTransactionConfirmed) {
      refetch()
    }
  }, [isApprovalSet, currentStep, refetch])

  useEffect(() => {
    const isBridgeTransactionConfirmed = isBridgeDone && currentStep === BridgeStep.Bridge

    if (isBridgeTransactionConfirmed) {
      goToNextStep()
    }
  }, [goToNextStep, currentStep, isBridgeDone])

  useEffect(() => {
    const isTransactionStatusAvailable = currentStep === BridgeStep.Success && isBridgeDone

    if (isTransactionStatusAvailable) {
      getBridgeTransactionStatus()
    }
  }, [currentStep, getBridgeTransactionStatus, isBridgeDone])

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
              currentStep === BridgeStep.Success &&
              bridgeTransactionStatus === BridgeStatus.Delivered
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
