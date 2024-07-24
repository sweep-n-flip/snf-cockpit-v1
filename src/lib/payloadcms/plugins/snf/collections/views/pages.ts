import type { Config } from 'payload'

export type Pages = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { beforeChange } from '../../hooks/utils/beforeChange'
import { afterRead } from '../../hooks/utils/afterRead'
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
        afterRead: [afterRead.homepageResolver()],
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
