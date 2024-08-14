import { useReadContract } from 'wagmi'

interface UseErc721isApprovedForAllProps {
  contractAddress?: string
  owner?: string
  operator?: string
  contractABI?: string
}

export const useErc721IsApprovedForAll = ({
  contractAddress,
  contractABI,
  owner,
  operator,
}: UseErc721isApprovedForAllProps) => {
  const { data, status, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'isApprovedForAll',
    args: [owner, operator],
    query: {
      enabled: !!contractAddress && !!contractABI && !!owner && !!operator,
      select(data) {
        return data
      },
    },
  })

  return {
    isApprovedForAll: data,
    loading: status === 'pending',
    refetch,
  }
}
