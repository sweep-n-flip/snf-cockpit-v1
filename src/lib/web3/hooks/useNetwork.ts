import { useAccount, useSwitchChain, useChains } from 'wagmi'
import { Chain } from '@/lib/web3/types'

export type UseNetworkProps = {}

export function useNetwork() {
  const chains = useChains()
  const { chain } = useAccount()
  const { error, switchChain, status } = useSwitchChain()

  return {
    chain: chain as Chain | undefined,
    loading: status === 'pending',
    error,
    status,
    chains,
    switchChain,
  }
}

export default useNetwork
