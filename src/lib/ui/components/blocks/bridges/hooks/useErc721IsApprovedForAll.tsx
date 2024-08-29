import { useReadContract } from 'wagmi'
import { erc721Abi } from 'viem'

interface UseErc721isApprovedForAllProps {
  contractAddress?: string
  owner?: string
  operator?: string
  chainId?: number
}

export const useErc721IsApprovedForAll = ({
  contractAddress,
  owner,
  operator,
  chainId,
}: UseErc721isApprovedForAllProps) => {
  const { data, status, refetch } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: erc721Abi,
    functionName: 'isApprovedForAll',
    args: [owner as `0x${string}`, operator as `0x${string}`],
    query: {
      enabled: !!contractAddress && !!owner && !!operator && !!chainId,
    },
    chainId,
  })

  return {
    isApprovedForAll: data,
    loading: status === 'pending',
    refetch,
  }
}
