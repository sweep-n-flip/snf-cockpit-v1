import { Address } from 'viem'

export type Collection = {
  address: Address
  name: string
  image?: string
  tokenCount: string
}

export type CollectionsParams = {
  chainId: number
  address: string
  collectionAddress?: string
}

export type CollectionsResponse = Collection[]
