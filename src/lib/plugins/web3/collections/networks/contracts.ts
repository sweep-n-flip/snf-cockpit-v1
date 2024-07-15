import type { Config } from 'payload'
import { fields } from '../../fields'

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
        group: `Network`,
      },
      fields: fields.contracts(),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    },
  ]

  return collectionsWithContracts
}
