import type { PaginatedDocs } from 'payload'
import { getConfig } from '../config'
import { RPCS } from '@/lib/payloadcms/types/payload-types'
import { Options } from 'node_modules/payload/dist/collections/operations/local/find'

export const getRpcs = async (
  options?: Partial<Options<'rpcs'>>,
): Promise<PaginatedDocs<RPCS>['docs']> => {
  const config = await getConfig()
  const result = await config.find({
    ...(options || {}),
    collection: 'rpcs',
  })

  const data = result.docs

  return data
}
