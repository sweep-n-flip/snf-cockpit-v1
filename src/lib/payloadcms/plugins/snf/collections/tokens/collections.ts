import type { Config } from 'payload'

export type Collections = {
  collections: Config['collections']
}

import { fields } from '../../fields'

export const collections = ({ collections }: Collections): Collections['collections'] => {
  const collectionsWithCollections = [
    ...(collections ? collections : []),
    {
      slug: `collections`,
      labels: {
        singular: `Collection`,
        plural: `Collections`,
      },
      typescript: {
        interface: `Collections`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name'],
        group: `Tokens`,
      },
      fields: fields.collections(),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
    },
  ]

  return collectionsWithCollections
}
