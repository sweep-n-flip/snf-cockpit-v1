import type { Config } from 'payload'

export type Collections = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export const widgets = ({ collections }: Collections): Collections['collections'] => {
  const collectionsWithCollections = [
    ...(collections ? collections : []),
    {
      slug: `bridgeWidgets`,
      labels: {
        singular: `Widget`,
        plural: `Widgets`,
      },
      disableDuplicate: true,
      typescript: {
        interface: `BridgeWidget`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name'],
        group: `Bridges`,
      },
      fields: fields.bridges.widgets({
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
