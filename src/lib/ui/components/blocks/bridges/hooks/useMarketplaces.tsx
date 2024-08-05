import { Chains, Marketplaces } from '@/lib/payloadcms/types/payload-types'
import { useEffect, useState } from 'react'
import { getChainMarketplaces } from '@/lib/payloadcms/services/networks/marketplaces'

export const useMarketplaces = (chain?: Chains) => {
  const [marketplaces, setMarketplaces] = useState<Marketplaces[]>([])
  const [loading, setLoading] = useState(true)

  // Get the block explorer for the chain
  useEffect(() => {
    const getMarketplaces = async () => {
      if (!chain) {
        return
      }

      const marketplaces = await getChainMarketplaces(chain)
      setMarketplaces(marketplaces)
      setLoading(false)
    }

    getMarketplaces()
  }, [chain])

  return { marketplaces, loading }
}
