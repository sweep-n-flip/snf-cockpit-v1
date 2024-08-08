import { Address } from 'viem'

export type ERC721Token = {
  tokenId: Address | string
  name: string
  image?: string
  collectionName: string
  collectionImageUrl?: string
}

export type ERC721Tokens = ERC721Token[]
