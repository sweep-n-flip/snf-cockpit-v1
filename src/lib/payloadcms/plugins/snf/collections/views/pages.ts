import type { Config } from 'payload'

export type Pages = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { beforeChange } from '../../hooks/collections/beforeChange'
import { admins, anyone } from '../../utils/validateRole'
import { blocks } from '../../blocks'

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
      fields: fields.views.pages({
        fieldsBefore: [
          ...fields.utils.slug({
            slugFieldProps: {
              fieldToFormat: 'title',
              index: true,
              unique: true,
            },
          }),
        ],
        fieldsAfter: [
          ...fields.layout.blocks({
            blocksBefore: [...blocks.bridges.widgets()],
          }),
        ],
      }),
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
