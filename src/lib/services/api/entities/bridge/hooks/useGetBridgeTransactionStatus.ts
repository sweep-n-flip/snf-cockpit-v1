'use client'

import { useLazyQuery } from '@apollo/client/react/hooks/useLazyQuery'
import { GET_BRIDGE_TRANSACTION_STATUS_QUERY } from '@/lib/services/api/entities/bridge/queries'
import { BridgeStatus, BridgeTransactionStatus } from '@/lib/services/api/entities/bridge/types'
import { Address } from 'viem'
import { useInterval } from 'usehooks-ts'

type BridgeTransactionStatusQuery = {
  getBridgeTransactionStatus: BridgeTransactionStatus
}

type UseGetBridgeTransactionStatusProps = {
  chainId?: number
  transactionHash?: Address
}

export function useGetBridgeTransactionStatus({
  chainId,
  transactionHash,
}: UseGetBridgeTransactionStatusProps) {
  const [getData, { data, loading, refetch }] = useLazyQuery<BridgeTransactionStatusQuery>(
    GET_BRIDGE_TRANSACTION_STATUS_QUERY,
    {
      context: {
        chainId,
      },
      fetchPolicy: 'no-cache',
      variables: {
        transactionHash,
        chainId,
      },
    },
  )

  useInterval(() => {
    if (transactionHash && data?.getBridgeTransactionStatus?.status === BridgeStatus.CONFIRMING) {
      refetch()
    }
  }, 6000)

  return {
    status: data?.getBridgeTransactionStatus?.status,
    loading,
    getData,
  }
}

export default useGetBridgeTransactionStatus
