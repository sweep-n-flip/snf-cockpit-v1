import { gql } from '@apollo/client/core'

export const GET_BRIDGE_TRANSACTION_STATUS_QUERY = gql`
  query GetBridgeTransactionStatus($chainId: Int!, $transactionHash: String!) {
    getBridgeTransactionStatus(chainId: $chainId, transactionHash: $transactionHash) {
      status
    }
  }
`
