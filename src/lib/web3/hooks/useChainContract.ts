import { useNetwork } from '@/lib/web3/hooks'
import { find } from 'lodash'
import { useChains } from 'wagmi'

export type UseChainContractProps = {
  slug: string
  defaultChainId: number
}

export function useChainContract({ slug, defaultChainId }: UseChainContractProps) {
  const chains = useChains()
  const { config } = useNetwork({ defaultChainId })

  return find(chains, { id: config.id })?.contracts?.[slug]
}

export default useChainContract
