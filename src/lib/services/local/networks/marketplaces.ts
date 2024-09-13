import type { PaginatedDocs } from 'payload'
import { getConfig } from '../config'
import { Marketplaces } from '@/lib/payloadcms/types/payload-types'
import { Options } from 'node_modules/payload/dist/collections/operations/local/find'

export const getMarketplaces = async (
  options?: Partial<Options<'marketplaces'>>,
): Promise<PaginatedDocs<Marketplaces>['docs']> => {
  const config = await getConfig()
  const result = await config.find({
    ...(options || {}),
    collection: 'marketplaces',
  })

  const data = result.docs

  return data
}
