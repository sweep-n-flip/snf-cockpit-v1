import type { PaginatedDocs } from 'payload'
import { getConfig } from '../config'
import { Contracts } from '@/lib/payloadcms/types/payload-types'
import { Options } from 'node_modules/payload/dist/collections/operations/local/find'

export const getContracts = async (
  options?: Partial<Options<'contracts'>>,
): Promise<PaginatedDocs<Contracts>['docs']> => {
  const config = await getConfig()
  const result = await config.find({
    ...(options || {}),
    collection: 'contracts',
  })

  const data = result.docs

  return data
}
