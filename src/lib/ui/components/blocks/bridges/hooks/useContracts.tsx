import { BlockExplorers } from '@/lib/payloadcms/types/payload-types'
import { useEffect, useState } from 'react'
import { getChainBlockExplorers } from '@/lib/services/local/networks/blockExplorers'
import { getChainContracts } from '@/lib/services/local/networks/contracts'

export const useContracts = (chainId?: number) => {
  const [blockExplorers, setBlockExplorers] = useState<BlockExplorers[]>([])
  const [loading, setLoading] = useState(true)

  // Get the block explorer for the chain
  useEffect(() => {
    const getContracts = async () => {
      if (!chainId) {
        return
      }

      const blockExplorers = await getChainContracts(chainId)
      setBlockExplorers(blockExplorers)
      setLoading(false)
    }

    getContracts()
  }, [chainId])

  return { blockExplorers, loading }
}
