import type { Config } from 'payload'

export type Collections = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export const bridge = ({ collections }: Collections): Collections['collections'] => {
  const collectionsWithCollections = [
    ...(collections ? collections : []),
    {
      slug: `bridges`,
      labels: {
        singular: `Bridge`,
        plural: `Bridges`,
      },
      disableDuplicate: true,
      typescript: {
        interface: `Bridges`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name'],
        group: `Widgets`,
      },
      fields: fields.widgets.bridge({
        fieldsBefore: [
          ...fields.utils.slug({
            slugFieldProps: {
              fieldToFormat: 'name',
              index: false,
              unique: false,
            },
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

  return collectionsWithCollections
}
