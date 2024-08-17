import { Address } from 'viem'
import { useReadContract, useTransactionConfirmations } from 'wagmi'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export type UseBridgeProps = {
  collectionAddress?: Address
  tokenIds?: (Address | string | number)[]
  toChainId?: number
  chainId?: number
  bridgeAddress?: Address
  bridgeABI?: unknown
}

export function useBridge({
  collectionAddress,
  tokenIds,
  bridgeAddress,
  toChainId,
  chainId,
  bridgeABI,
}: UseBridgeProps) {
  const { data: feeEstimative } = useReadContract({
    address: bridgeAddress,
    abi: bridgeABI,
    functionName: 'estimateFeeSendERC721UsingNative',
    args: [toChainId, collectionAddress, tokenIds],
    chainId,
    query: {
      enabled: !!toChainId && !!collectionAddress && !!tokenIds && !!bridgeAddress,
      select(data) {
        return BigInt(String(data))
      },
    },
  })

  const { writeContractAsync, status, data: txHash, reset } = useWriteContract()

  const { isLoading: isTransactionLoading, data: receiptData } = useWaitForTransactionReceipt({
    hash: txHash,
    confirmations: 12,
    pollingInterval: 5000,
    query: {
      enabled: !!txHash,
    },
  })

  const { status: confirmationStatus } = useTransactionConfirmations({
    transactionReceipt: receiptData,
    query: {
      enabled: !!receiptData,
    },
  })

  const handleBridge = async () => {
    if (!chainId || !bridgeAddress || !bridgeABI) {
      return
    }

    reset()

    try {
      await writeContractAsync({
        address: bridgeAddress,
        abi: bridgeABI,
        functionName: 'sendERC721UsingNative',
        args: [toChainId, collectionAddress, tokenIds],
        value: feeEstimative,
        chainId,
      })
    } catch (error) {
      reset()
      throw error
    }
  }

  return {
    bridge: handleBridge,
    isBridgeDone: status === 'success' && confirmationStatus === 'success',
    loading: status === 'pending' || isTransactionLoading,
    transactionHash: txHash,
  }
}

export default useBridge
