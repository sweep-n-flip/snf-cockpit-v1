// import { Address } from 'viem'
// import { useReadContract, useTransactionConfirmations } from 'wagmi'
// import BridgeABI from '@/lib/web3/abi/bridge.json'
// import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
// import { ChainId } from '@/lib/web3/types/chain'

export type UseBridgeProps = {
  // collectionAddress?: Address
  // tokenIds?: (Address | string | number)[]
  // toChainId?: ChainId
  // bridgeAddress?: Address
}

export function useBridge() {
  // {
  // collectionAddress,
  // tokenIds,
  // bridgeAddress,
  // toChainId,
  // }: UseBridgeProps,
  // const { data: feeEstimative } = useReadContract({
  //   address: bridgeAddress,
  //   abi: BridgeABI,
  //   functionName: 'estimateFeeSendERC721UsingNative',
  //   args: [toChainId, collectionAddress, tokenIds],
  //   query: {
  //     enabled: !!toChainId && !!collectionAddress && !!tokenIds && !!bridgeAddress,
  //     select(data) {
  //       return BigInt(String(data))
  //     },
  //   },
  // })
  // const { writeContractAsync, status, data: txHash, reset } = useWriteContract()
  // const { isLoading: isTransactionLoading, data: receiptData } = useWaitForTransactionReceipt({
  //   hash: txHash,
  //   confirmations: 12,
  //   pollingInterval: 5000,
  //   query: {
  //     enabled: !!txHash,
  //   },
  // })
  // const { status: confirmationStatus } = useTransactionConfirmations({
  //   transactionReceipt: receiptData,
  //   query: {
  //     enabled: !!receiptData,
  //   },
  // })
  // const handleBridge = async () => {
  //   if (!bridgeAddress) {
  //     throw new Error('Bridge address is required')
  //   }
  //   reset()
  //   try {
  //     await writeContractAsync({
  //       address: bridgeAddress,
  //       abi: BridgeABI,
  //       functionName: 'sendERC721UsingNative',
  //       args: [toChainId, collectionAddress, tokenIds],
  //       value: feeEstimative,
  //     })
  //   } catch (error) {
  //     reset()
  //     throw error
  //   }
  // }
  // return {
  //   bridge: handleBridge,
  //   isTransactionSeattle: status === 'success' && confirmationStatus === 'success',
  //   loading: status === 'pending' || isTransactionLoading,
  //   transactionHash: txHash,
  // }

  return {
    bridge: (data: any) => {
      console.log(data)
    },
    isTransactionSeattle: false,
    loading: false,
    transactionHash: undefined,
  }
}

export default useBridge
