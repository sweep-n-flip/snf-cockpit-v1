import { Address, erc721Abi } from 'viem'
import { useTransactionConfirmations } from 'wagmi'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export type UseERC721SetApprovalForAllProps = {
  collectionAddress?: Address
  operator?: Address
}

export function useERC721SetApprovalForAll({
  collectionAddress,
  operator,
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
    if (!collectionAddress || !operator) return
    reset()

    try {
      await writeContractAsync({
        address: collectionAddress,
        abi: erc721Abi,
        functionName: 'setApprovalForAll',
        args: [operator, true],
      })
    } catch (error) {
      reset()
      throw error
    }
  }

  return {
    approve: handleApprove,
    isTransactionSeattle: status === 'success' && confirmationStatus === 'success',
    loading: status === 'pending' || isTransactionLoading,
  }
}

export default useERC721SetApprovalForAll
