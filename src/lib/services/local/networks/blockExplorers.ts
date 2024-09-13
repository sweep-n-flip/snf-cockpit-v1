import type { PaginatedDocs } from 'payload'
import { getConfig } from '../config'
import { BlockExplorers } from '@/lib/payloadcms/types/payload-types'
import { Options } from 'node_modules/payload/dist/collections/operations/local/find'

export const getBlockExplorers = async (
  options?: Partial<Options<'block_explorers'>>,
): Promise<PaginatedDocs<BlockExplorers>['docs']> => {
  const config = await getConfig()
  const result = await config.find({
    ...(options || {}),
    collection: 'block_explorers',
  })

  const data = result.docs

  return data
}
