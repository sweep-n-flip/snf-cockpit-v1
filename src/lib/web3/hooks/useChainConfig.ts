import { find, filter } from 'lodash'
import { useMemo } from 'react'
import { useChains } from 'wagmi'

export type UseChainConfigProps = {
  chainId?: number
  defaultChainId: number
}

const checkChainNotEqual = (chainToCheck: number, chainId?: number) => {
  return chainToCheck !== chainId
}

export function useChainConfig({ chainId, defaultChainId }: UseChainConfigProps) {
  const chains = useChains()
  const chainIdRefined = useMemo(() => find(chains, { id: chainId }), [chains, chainId])

  const defaultConfig = useMemo(
    () => chains?.[chainIdRefined?.id || defaultChainId],
    [chainIdRefined, chains, defaultChainId],
  )

  /// returns only chains != chainId
  const remainingChains = useMemo(
    () => filter(chains, (chain) => checkChainNotEqual(chain?.id, chainId)),
    [chainId, chains],
  )

  return {
    config: defaultConfig,
    remainingChains,
  }
}

export default useChainConfig
