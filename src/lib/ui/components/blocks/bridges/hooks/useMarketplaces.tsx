import { Marketplaces } from '@/lib/payloadcms/types/payload-types'
import { useEffect, useState } from 'react'
import { getChainMarketplaces } from '@/lib/services/local/networks/marketplaces'

export const useMarketplaces = (chainId?: number) => {
  const [marketplaces, setMarketplaces] = useState<Marketplaces[]>([])
  const [loading, setLoading] = useState(true)

  // Get the block explorer for the chain
  useEffect(() => {
    const getMarketplaces = async () => {
      if (!chainId) {
        return
      }

      const marketplaces = await getChainMarketplaces(chainId)
      setMarketplaces(marketplaces)
      setLoading(false)
    }

    getMarketplaces()
  }, [chainId])

  return { marketplaces, loading }
}
