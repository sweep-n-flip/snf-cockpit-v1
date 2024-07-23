import { useAccount, useSwitchChain, useChains } from 'wagmi'
import { useChainConfig } from './useChainConfig'
import { Chain } from '@/lib/web3/types'

export type UseNetworkProps = {
  defaultChainId: number
}

export function useNetwork({ defaultChainId }: UseNetworkProps) {
  const { chain } = useAccount()
  const chains = useChains()

  const { error, switchChain, status } = useSwitchChain()

  const { config, remainingChains } = useChainConfig({
    defaultChainId,
    chainId: chain?.id || defaultChainId,
  })

  return {
    error,
    loading: status === 'pending',
    status,
    chains,
    chain: chain as Chain | undefined,
    switchChain,
    config,
    remainingChains,
  }
}

export default useNetwork
