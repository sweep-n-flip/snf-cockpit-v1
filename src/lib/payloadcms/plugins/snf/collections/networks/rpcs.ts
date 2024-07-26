import type { Config } from 'payload'
import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export type Chains = {
  collections: Config['collections']
}

export const rpcs = ({ collections }: Chains): Chains['collections'] => {
  const collectionsWithRpcs = [
    ...(collections ? collections : []),
    {
      slug: `rpcs`,
      labels: {
        singular: `RPC`,
        plural: `RPCs`,
      },
      typescript: {
        interface: `RPCS`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name'],
        group: `Network`,
      },
      fields: fields.rpcs({
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

  return collectionsWithRpcs
}
