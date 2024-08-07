import { Address } from 'viem'

export type QueryStatusParams = {
  chainId: number
  transactionHash: Address
}

export enum Status {
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CONFIRMING = 'CONFIRMING',
  INFLIGHT = 'INFLIGHT',
}

export type QueryStatusResponse = {
  status: Status
}
