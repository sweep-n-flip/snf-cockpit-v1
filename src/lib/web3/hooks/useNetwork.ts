import { useAccount, useSwitchChain, useChains } from 'wagmi'
import { useChainConfig } from './useChainConfig'
import { Chain } from '@/lib/web3/types'

export type UseNetworkProps = {
  defaultChainId: number
}

export function useNetwork({ defaultChainId }: UseNetworkProps) {
  const { chain, chainId } = useAccount()

  const chains = useChains()

  const { error, switchChain, status } = useSwitchChain()

  const { config, remainingChains } = useChainConfig({
    defaultChainId,
    chainId: chainId || defaultChainId,
  })

  return {
    chain: chain as Chain | undefined,
    loading: status === 'pending',
    error,
    status,
    chains,
    switchChain,
    config,
    remainingChains,
  }
}

export default useNetwork
