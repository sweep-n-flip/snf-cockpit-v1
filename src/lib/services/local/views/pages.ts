import type { PaginatedDocs } from 'payload'
import { getConfig } from '../config'
import { Pages } from '@/lib/payloadcms/types/payload-types'
import { Options } from 'node_modules/payload/dist/collections/operations/local/find'

export const getPages = async (
  options?: Partial<Options<'pages'>>,
): Promise<PaginatedDocs<Pages>['docs']> => {
  try {
    const config = await getConfig()
    const result = await config.find({
      ...(options || {}),
      collection: 'pages',
    })

    const data = result.docs

    return data
  } catch {
    return []
  }
}

export const getPage = async (
  options?: Partial<Options<'pages'>>,
): Promise<PaginatedDocs<Pages>['docs'][0] | null> => {
  try {
    const docs = await getPages(options)

    if (docs.length > 0) {
      return docs[0]
    }

    return null
  } catch {
    return null
  }
}
