import type { Config } from 'payload'
import { fields } from '../../fields'

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
      fields: fields.blockExplorers(),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
    },
  ]

  return collectionsWithBlockExplorers
}
