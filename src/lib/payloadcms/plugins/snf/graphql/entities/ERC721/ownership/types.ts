export type BalanceParams = {
  chainId: number
  ownerAddress: string
  collectionAddress: string
}

export type BalanceResponse = {
  tokenIds: string[]
  collectionAddress: string
  chainId: number
  ownerAddress: string
  count: number
}

export type ApprovalParams = {
  chainId: number
  ownerAddress: string
  collectionAddress: string
  operatorAddress: string
}

export type ApprovalResponse = {
  isApprovedForAll: boolean
}

export type CollectionsParams = {
  chainId: number
  address: string
}

export type Collection = {
  address: string
  name: string
  image?: string
  tokenCount: string
}

export type CollectionsResponse = { collections: Collection[] }
