import type { Config } from 'payload'

export type Chains = {
  collections: Config['collections']
}

import { fields } from '../../fields'
import { admins, anyone } from '../../utils/validateRole'

export const chains = ({ collections }: Chains): Chains['collections'] => {
  const collectionsWithChain = [
    ...(collections ? collections : []),
    {
      slug: `chains`,
      labels: {
        singular: `Chain`,
        plural: `Chains`,
      },
      typescript: {
        interface: `Chains`,
      },
      disableDuplicate: true,
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name', 'testnet'],
        group: `Network`,
      },
      fields: fields.chains(),
      access: {
        read: anyone,
        create: admins,
        update: admins,
        delete: admins,
      },
    },
  ]

  return collectionsWithChain
}
