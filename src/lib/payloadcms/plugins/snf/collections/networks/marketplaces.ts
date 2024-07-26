import type { Config } from 'payload'
import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export type Chains = {
  collections: Config['collections']
}

export const marketplaces = ({ collections }: Chains): Chains['collections'] => {
  const collectionsWithMarketplaces = [
    ...(collections ? collections : []),

    {
      slug: `marketplaces`,
      labels: {
        singular: `Marketplace`,
        plural: `Marketplaces`,
      },
      typescript: {
        interface: `Marketplaces`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name'],
        group: `Network`,
      },
      fields: fields.marketplaces({
        fieldsBefore: [
          ...fields.slug({
            slugFieldProps: {
              fieldToFormat: 'name',
              index: false,
              unique: true,
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

  return collectionsWithMarketplaces
}
