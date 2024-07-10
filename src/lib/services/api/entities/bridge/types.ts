export enum BridgeStatus {
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  Confirming = 'CONFIRMING',
}

export type BridgeTransactionStatus = {
  status: BridgeStatus
}
