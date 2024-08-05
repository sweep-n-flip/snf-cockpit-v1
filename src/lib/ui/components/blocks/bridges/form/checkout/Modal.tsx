'use client'

import { Default } from '@/lib/ui/components/modal'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { TokenType, BridgeStep } from '@/lib/ui/components/blocks/bridges/types/bridge'
import { useWallet } from '@/lib/web3'
import { useStep, useToggle } from 'usehooks-ts'
import { useGetBridgeTransactionStatus } from '@/lib/services/api/entities/bridge/hooks/useGetBridgeTransactionStatus'
import { Address } from 'viem'
import { BridgeStatus } from '@/lib/services/api/entities/bridge/types'
import { DEFAULT_FORM_STATE } from '@/lib/ui/components/blocks/bridges/utils/constants/form'
import { TOTAL_STEPS } from '@/lib/ui/components/blocks/bridges/utils/constants/checkout'
import { Steps } from '@/lib/ui/components/blocks/bridges/form/checkout'

import { ERC721Tokens, ERC721Collections } from '@/lib/services/api/entities/ERC721/types'
import classNames from 'classnames'
import { Chains } from '@/lib/payloadcms/types/payload-types'

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
}

export const Modal = ({ children, onCloseAfterBridge, tokens, collections }: ModalProps) => {
  const { address } = useWallet()
  const [isModalOpen, , setIsModalOpen] = useToggle()

  const [formData, setFormaData] = useState<BridgeData>(DEFAULT_FORM_STATE)

  const tokenInChain = useMemo(() => formData[TokenType.TokenIn].chain, [formData])
  const tokenOutChain = useMemo(() => formData[TokenType.TokenOut].chain, [formData])

  const {
    getData: getBridgeTransactionStatus,
    status: bridgeTransactionStatus,
    loading: bridgeTransactionStatusLoading,
  } = useGetBridgeTransactionStatus({
    chainId: tokenInChain.chainId,
    transactionHash,
  })

  /// steps handler
  const [currentStep, helpers] = useStep(TOTAL_STEPS)
  const { goToNextStep, reset: resetSteps, goToPrevStep, setStep } = helpers

  const isTransactionPending =
    bridgeTransactionStatusLoading || bridgeTransactionStatus === BridgeStatus.Confirming

  const resetState = () => {
    resetSteps()
    setFormaData(DEFAULT_FORM_STATE)
  }

  const handleOpenBridge = (data: BridgeData) => {
    resetState()
    setIsModalOpen(true)
    setFormaData((prev) => ({ ...prev, ...data }))
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
    const isApprovedForAllTransactionConfirmed =
      currentStep === BridgeStep.Approve && isTransactionSeattleForIsApprovedForAll

    if (isApprovedForAllTransactionConfirmed) {
      refetch()
    }
  }, [isTransactionSeattleForIsApprovedForAll, currentStep, refetch])

  useEffect(() => {
    const isBridgeTransactionConfirmed =
      isTransactionSeattleForBridge && currentStep === BridgeStep.Bridge

    if (isBridgeTransactionConfirmed) {
      goToNextStep()
    }
  }, [goToNextStep, currentStep, isTransactionSeattleForBridge])

  useEffect(() => {
    const isTransactionStatusAvailable =
      currentStep === BridgeStep.Success && isTransactionSeattleForBridge

    if (isTransactionStatusAvailable) {
      getBridgeTransactionStatus()
    }
  }, [currentStep, getBridgeTransactionStatus, isTransactionSeattleForBridge])

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
            !isTransactionPending
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
