export enum BridgeStatus {
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CONFIRMING = 'CONFIRMING',
  INFLIGHT = 'INFLIGHT',
}

export type BridgeTransactionStatus = {
  status: BridgeStatus
}
