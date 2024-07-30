import type { Config } from 'payload'

export type Collections = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export const categories = ({ collections }: Collections): Collections['collections'] => {
  const collectionsWithCollections = [
    ...(collections ? collections : []),
    {
      slug: `bridge_categories`,
      labels: {
        singular: `Category`,
        plural: `Categories`,
      },
      /// prefix?
      disableDuplicate: true,
      typescript: {
        interface: `BridgeCategories`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name', 'setup.version'],
        group: `Bridges`,
      },
      fields: fields.bridges.categories({
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
