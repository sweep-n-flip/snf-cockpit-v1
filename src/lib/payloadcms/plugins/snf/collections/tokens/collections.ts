import type { Config } from 'payload'

export type Collections = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export const collections = ({ collections }: Collections): Collections['collections'] => {
  const collectionsWithCollections = [
    ...(collections ? collections : []),
    {
      slug: `collections`,
      labels: {
        singular: `Collection`,
        plural: `Collections`,
      },
      disableDuplicate: true,
      typescript: {
        interface: `Collections`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name'],
        group: `Tokens`,
      },
      fields: fields.tokens.collections({
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
