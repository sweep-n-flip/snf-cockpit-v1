import { CollectionBeforeChangeHook } from 'payload'

import { formatToSlug } from '../../../utils/format'

export const slugfy =
  (): CollectionBeforeChangeHook =>
  ({ data }) => {
    if (typeof data?.slug !== `undefined`) {
      const slugs = data?.slug.split(`-`)
      if (slugs[slugs.length - 1] === `copy` || data?.slug === null || data?.slug === ``) {
        data.slug = formatToSlug(data?.title)
      }
    }
  }

export default slugfy
