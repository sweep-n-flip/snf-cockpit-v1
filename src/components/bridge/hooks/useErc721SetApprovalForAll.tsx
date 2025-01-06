import { Address, erc721Abi } from 'viem'
import { useTransactionConfirmations } from 'wagmi'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export type UseERC721SetApprovalForAllProps = {
  collectionAddress?: Address
  operator?: Address
  chainId?: number
}

export function useErc721SetApprovalForAll({
  collectionAddress,
  operator,
  chainId,
}: UseERC721SetApprovalForAllProps) {
  const { writeContractAsync, status, data, reset } = useWriteContract()

  const { isLoading: isTransactionLoading, data: receiptData } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: 12,
    pollingInterval: 5000,
  })

  const { status: confirmationStatus } = useTransactionConfirmations({
    transactionReceipt: receiptData,
  })

  const handleApprove = async () => {
    if (!collectionAddress || !operator || !chainId) {
      return
    }
    reset()

    try {
      await writeContractAsync({
        address: collectionAddress,
        abi: erc721Abi,
        functionName: 'setApprovalForAll',
        args: [operator, true],
        chainId,
      })
    } catch (error) {
      reset()
      throw error
    }
  }

  return {
    approve: handleApprove,
    isApprovalSet: status === 'success' && confirmationStatus === 'success',
    loading: status === 'pending' || isTransactionLoading,
  }
}

export default useErc721SetApprovalForAll
