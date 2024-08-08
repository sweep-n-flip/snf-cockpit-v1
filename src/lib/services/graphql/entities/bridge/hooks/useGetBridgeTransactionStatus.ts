'use client'

import {
  Status,
  QueryStatusParams,
  QueryStatusResponse,
} from '@/lib/payloadcms/plugins/snf/graphql/entities/bridge/transactions/types'

import { useInterval } from 'usehooks-ts'
import { useLazyQuery } from '@apollo/client/react/hooks/useLazyQuery'
import { queryName } from '@/lib/payloadcms/plugins/snf/graphql/entities/bridge/transactions/status'
import { GET_BRIDGE_TRANSACTION_STATUS_QUERY } from '@/lib/services/graphql/entities/bridge/queries'

export function useGetBridgeTransactionStatus({ chainId, transactionHash }: QueryStatusParams) {
  const [getData, { data, loading, refetch }] = useLazyQuery<
    { [queryName: string]: QueryStatusResponse },
    QueryStatusParams
    /// todo: get it from payload config custom? make it only available in the plugin
  >(GET_BRIDGE_TRANSACTION_STATUS_QUERY, {
    context: {
      chainId,
    },
    fetchPolicy: 'no-cache',
    variables: {
      transactionHash,
      chainId,
    },
  })

  useInterval(() => {
    if (transactionHash && data?.[queryName]?.status === Status.CONFIRMING) {
      refetch()
    }
  }, 6000)

  return {
    status: data?.[queryName]?.status,
    loading,
    getData,
  }
}

export default useGetBridgeTransactionStatus
