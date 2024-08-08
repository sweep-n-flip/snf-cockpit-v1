export type IsApprovedForAllParams = {
  chainId: number
  ownerAddress: string
  collectionAddress: string
  operatorAddress: string
}

export type IsApprovedForAllResponse = {
  isApprovedForAll: boolean
}
