import { Address } from 'viem'

export type BridgeTransactionStatusParams = {
  chainId: number
  transactionHash: Address
}
