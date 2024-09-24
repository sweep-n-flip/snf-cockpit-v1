import type { PaginatedDocs } from 'payload'
import { getConfig } from '../config'
import { Chains } from '@/lib/payloadcms/types/payload-types'
import { Options } from 'node_modules/payload/dist/collections/operations/local/find'

export const getChains = async (
  options?: Partial<Options<'chains'>>,
): Promise<PaginatedDocs<Chains>['docs']> => {
  const config = await getConfig()
  const result = await config.find({
    ...(options || {}),
    collection: 'chains',
  })

  const data = result.docs

  return data
}
