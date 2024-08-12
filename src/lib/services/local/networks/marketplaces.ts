import nextPayloadCMS from '../config'
import { Chains } from '@/lib/payloadcms/types/payload-types'

export const getMarketplaces = async (
  options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>,
) => {
  const result = await nextPayloadCMS.find({
    ...(options || {}),
    collection: 'marketplaces',
  })

  const data = result.docs

  return data
}

export const getChainMarketplaces = async (
  chain: Chains,
  options?: Partial<Parameters<typeof nextPayloadCMS.find>[0]>,
) => {
  return getMarketplaces({
    ...(options || {}),
    where: {
      chain,
    },
  })
}
