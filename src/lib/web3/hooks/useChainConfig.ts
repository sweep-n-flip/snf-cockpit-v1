import { ChainId, allowedChains } from '@/lib/web3/config/chains'
import { find, filter } from 'lodash'
import { useMemo } from 'react'
import appConfig from '@/lib/config'

export type UseChainConfigProps = {
  chainId?: ChainId
}

const checkChainNotEqual = (chainToCheck: ChainId, chainId?: ChainId) => {
  return chainToCheck !== chainId
}

export function useChainConfig({ chainId }: UseChainConfigProps) {
  const chainIdRefined = useMemo(() => find(allowedChains, { id: chainId }), [chainId])

  const defaultConfig = useMemo(
    () => allowedChains?.[chainIdRefined?.id || appConfig.networks.defaultChainId],
    [chainIdRefined],
  )

  /// returns only chains != chainId
  const remainingChains = useMemo(
    () => filter(allowedChains, (chain) => checkChainNotEqual(chain?.id, chainId)),
    [chainId],
  )

  return {
    config: defaultConfig,
    remainingChains,
  }
}

export default useChainConfig
