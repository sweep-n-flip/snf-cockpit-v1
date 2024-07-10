'use client'

import { Default } from '@/lib/ui/components/modal'
import { ChainId } from '@/lib/web3/types/chain'
import { ReactNode, useEffect, useState } from 'react'
import { TokenType, BridgeStep } from '@/lib/bridge/types/bridge'
import { useChainConfig, useWallet } from '@/lib/web3'
import { useStep, useToggle } from 'usehooks-ts'
import { useGetERC721IsApprovedForAll } from '@/lib/services/api/entities/ERC721/hooks/useGetERC721IsApprovedForAll'
import { useGetBridgeTransactionStatus } from '@/lib/services/api/entities/bridge/hooks/useGetBridgeTransactionStatus'
import { Address } from 'viem'
import { useBridge, useERC721SetApprovalForAll } from '@/lib/web3/hooks'
import { BridgeStatus } from '@/lib/services/api/entities/bridge/types'
import { DEFAULT_FORM_STATE } from '@/lib/bridge/utils/constants/form'
import { TOTAL_STEPS } from '@/lib/bridge/utils/constants/checkout'
import { Steps } from '@/lib/bridge/components/widget/form/checkout'

import { ERC721Tokens, ERC721Collections } from '@/lib/services/api/entities/ERC721/types'
import classNames from 'classnames'

export type BridgeData = {
  [key in TokenType]: {
    collectionAddress: Address
    tokenIds: (Address | string | number)[]
    chainId: ChainId
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

  const { config: tokenInChainConfig } = useChainConfig({
    chainId: formData[TokenType.TokenIn].chainId,
  })

  const { config: tokenOutChainConfig } = useChainConfig({
    chainId: formData[TokenType.TokenOut].chainId,
  })

  const {
    isApprovedForAll,
    refetch,
    loading: getER721IsApprovedForAllLoading,
  } = useGetERC721IsApprovedForAll({
    chainId: formData[TokenType.TokenIn].chainId,
    collectionAddress: formData[TokenType.TokenIn].collectionAddress,
    operatorAddress: tokenInChainConfig?.contracts.bridge_v1?.address,
    address,
  })

  const {
    approve,
    loading: isApproveLoading,
    isTransactionSeattle: isTransactionSeattleForIsApprovedForAll,
  } = useERC721SetApprovalForAll({
    collectionAddress: formData[TokenType.TokenIn].collectionAddress,
    operator: tokenInChainConfig?.contracts.bridge_v1?.address,
  })

  const {
    bridge,
    loading: isBridgeLoading,
    isTransactionSeattle: isTransactionSeattleForBridge,
    transactionHash,
  } = useBridge({
    collectionAddress: formData[TokenType.TokenIn].collectionAddress,
    tokenIds: formData[TokenType.TokenIn].tokenIds,
    bridgeAddress: tokenInChainConfig?.contracts.bridge_v1?.address,
    toChainId: formData[TokenType.TokenOut].chainId,
  })

  const {
    getData: getBridgeTransactionStatus,
    status: bridgeTransactionStatus,
    loading: bridgeTransactionStatusLoading,
  } = useGetBridgeTransactionStatus({
    chainId: formData[TokenType.TokenIn].chainId,
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
            chainIn={tokenInChainConfig}
            chainOut={tokenOutChainConfig}
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
                onBck={handleStepBack}
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
