import { BlockExplorers, Chains } from '@/lib/payloadcms/types/payload-types'
import { useEffect, useState } from 'react'
import { getChainBlockExplorers } from '@/lib/services/local/networks/blockExplorers'

export const useBlockExplorers = (chain?: Chains) => {
  const [blockExplorers, setBlockExplorers] = useState<BlockExplorers[]>([])
  const [loading, setLoading] = useState(true)

  // Get the block explorer for the chain
  useEffect(() => {
    const getBlockExplorers = async () => {
      if (!chain) {
        return
      }

      // const blockExplorers = await getChainBlockExplorers(chain)
      setBlockExplorers([])
      setLoading(false)
    }

    getBlockExplorers()
  }, [chain])

  return { blockExplorers, loading }
}
