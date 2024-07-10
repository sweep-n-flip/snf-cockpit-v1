import { allowedChains } from '@/lib/web3/config/chains'
import { ChainContracts } from '@/lib/web3/types/chain'
import { useNetwork } from '@/lib/web3/hooks'

export function useChainContract<T extends keyof ChainContracts>(contractName: T) {
  const { config } = useNetwork()

  return allowedChains[config.id].contracts[contractName]
}

export default useChainContract
