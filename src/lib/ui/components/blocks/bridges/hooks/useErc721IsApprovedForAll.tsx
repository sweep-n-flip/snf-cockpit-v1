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
    address: contractAddress,
    abi: erc721Abi,
    functionName: 'isApprovedForAll',
    args: [owner, operator],
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
