export type CollectionMetadataParams = {
  chainId: number
  collectionAddress: string
}

export type CollectionMetadataResponse = {
  name: string
  symbol: string
  description: string
  image: string
}
