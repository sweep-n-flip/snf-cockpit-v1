import { Chains } from '@/lib/payloadcms/types/payload-types'
import { useEffect, useState } from 'react'
import nextPayloadCMS from '@/lib/payloadcms/services/config'

export const useChain = (chainId?: number) => {
  const [chain, setChain] = useState<Chains | undefined>()

  useEffect(() => {
    if (!chainId) {
      return
    }

    const fetchChain = async () => {
      const foundChain = await nextPayloadCMS.find({
        collection: 'chains',
        where: {
          chainId,
        },
      })
      setChain(foundChain[0] as Chains)
    }

    fetchChain()
  }, [chainId])

  return {
    chain,
  }
}
