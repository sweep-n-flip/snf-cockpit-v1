import type { Config } from 'payload'

export type Pages = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { beforeChange } from '../../hooks/utils/beforeChange'
import { admins, anyone } from '../../utils/validateRole'

export const pages = ({ collections }: Pages): Pages['collections'] => {
  const collectionsWithPages = [
    ...(collections ? collections : []),
    {
      slug: `pages`,
      labels: {
        singular: `Page`,
        plural: `Pages`,
      },
      typescript: {
        interface: `Pages`,
      },
      admin: {
        useAsTitle: `title`,
        defaultColumns: [`title`, `slug`],
        group: `Views`,
      },
      hooks: {
        beforeChange: [beforeChange.slugfy(), beforeChange.populatePublishedDate()],
      },
      timestamps: true,
      fields: fields.pages(),
      access: {
        read: anyone,
        create: admins,
        update: admins,
        delete: admins,
      },
    },
  ]

  return collectionsWithPages
}
