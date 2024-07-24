import type { CollectionConfig } from 'payload'

import { formatSlug } from '../../hooks/utils/beforeValidate/formatSlug'

export const slug = (slugField: string): CollectionConfig['fields'] => {
  return [
    {
      name: `slug`,
      type: `text`,
      index: true,
      admin: {
        position: `sidebar`,
      },
      hooks: {
        beforeValidate: [formatSlug(slugField)],
      },
    },
  ]
}
