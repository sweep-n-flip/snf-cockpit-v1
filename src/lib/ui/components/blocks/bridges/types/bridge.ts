import { Address } from 'viem'

export enum TokenType {
  TokenIn = 'tokenIn',
  TokenOut = 'tokenOut',
}

export type FormDataType = {
  [key in TokenType]: {
    chainId: number
    collectionAddress: Address
    tokenIds: (Address | string | number)[]
  }
}

export enum BridgeStep {
  Details = 1,
  Approve = 2,
  Bridge = 3,
  Success = 4,
}
