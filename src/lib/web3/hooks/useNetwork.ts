import { useAccount, useSwitchChain } from 'wagmi'
import useChainConfig from './useChainConfig'
import { Chain } from '@/lib/web3/types/chain'
import appConfig from '@/lib/config'

export interface ChainConfig extends Chain {
  unsupported?: boolean
}

export function useNetwork() {
  const { chain } = useAccount()

  const { chains, error, switchChain, status } = useSwitchChain()

  const { config, remainingChains } = useChainConfig({
    chainId: chain?.id || appConfig.networks.defaultChainId,
  })

  return {
    error,
    loading: status === 'pending',
    status,
    chains,
    chain: chain as ChainConfig | undefined,
    switchChain,
    config,
    remainingChains,
  }
}

export default useNetwork
