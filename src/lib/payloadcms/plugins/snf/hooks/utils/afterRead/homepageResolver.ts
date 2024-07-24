import { Pages } from '@/lib/payloadcms/types/payload-types'
import { checkRole } from '../../../utils/checkRole'
import { PayloadRequest } from 'payload'

/**
 * This homepage resolver is a function that get a slug from a preMiddleware, and remove the actual slug
 * It is intended to make sure the slug of homepage empty on the API
 * @returns Page
 */

export const homepageResolver =
  () =>
  async ({ doc, req: { payload, user } }: { doc: Pages; req: PayloadRequest }): Promise<Pages> => {
    const project = await payload.findGlobal({
      slug: 'project',
    })
    if (
      !checkRole([`admin`], user ? user : undefined) &&
      doc.id === (project.views.defaultView as Pages).id
    ) {
      doc.slug = ``
    }

    return doc
  }
