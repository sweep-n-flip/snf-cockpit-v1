'use client'

import { useState, useEffect } from 'react'
import { getBridge } from '@/lib/services/local/products/bridge'
import { Bridge as BridgeType } from '@/lib/payloadcms/types/payload-types'

const useBridge = () => {
  const [data, setData] = useState<BridgeType | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchBridgeData = async () => {
      try {
        const data = await getBridge()
        setData(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchBridgeData()
  }, [])

  return { data, loading, error }
}

export default useBridge
