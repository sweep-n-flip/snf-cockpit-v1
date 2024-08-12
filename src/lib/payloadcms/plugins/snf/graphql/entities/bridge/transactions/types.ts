import { Address } from 'viem'

export enum Status {
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CONFIRMING = 'CONFIRMING',
  INFLIGHT = 'INFLIGHT',
}

export type QueryStatusParams = {
  chainId: number
  transactionHash: Address
}

export type QueryStatusResponse = {
  status: Status
}
