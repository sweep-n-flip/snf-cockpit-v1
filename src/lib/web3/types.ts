import { ChainFormatters } from 'viem'
import { Chain as WagmiChain } from 'wagmi/chains'
import { ChainCustom } from '@/lib/payloadcms/types/chains'

export interface Chain extends WagmiChain<ChainFormatters, ChainCustom> {
  unsupported?: boolean
}
