import { Chain } from '@/lib/web3/types/chain'
import { ChainId, allowedChains } from '@/lib/web3/config/chains'

export const getChain = (chainId: ChainId): Chain => {
  return allowedChains[chainId]
}

export const configUtils = {
  getChain,
}

export default configUtils
