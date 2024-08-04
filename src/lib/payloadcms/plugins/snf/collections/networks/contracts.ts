import type { Config } from 'payload'
import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export type Chains = {
  collections: Config['collections']
}

export const contracts = ({ collections }: Chains): Chains['collections'] => {
  const collectionsWithContracts = [
    ...(collections ? collections : []),

    {
      slug: `contracts`,
      labels: {
        singular: `Contract`,
        plural: `Contracts`,
      },
      typescript: {
        interface: `Contracts`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name'],

        group: `Network`,
      },
      fields: fields.networks.contracts({
        fieldsBefore: [
          ...fields.utils.slug({
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

  return collectionsWithContracts
}
