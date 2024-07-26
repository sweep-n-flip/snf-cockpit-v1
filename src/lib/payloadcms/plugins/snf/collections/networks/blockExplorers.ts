import type { Config } from 'payload'
import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export type Chains = {
  collections: Config['collections']
}

export const blockExplorers = ({ collections }: Chains): Chains['collections'] => {
  const collectionsWithBlockExplorers = [
    ...(collections ? collections : []),

    {
      slug: `blockExplorers`,
      labels: {
        singular: `Block Explorer`,
        plural: `Block Explorers`,
      },
      typescript: {
        interface: `BlockExplorers`,
      },
      admin: {
        useAsTitle: `name`,
        group: `Network`,
      },
      fields: fields.blockExplorers({
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

  return collectionsWithBlockExplorers
}
