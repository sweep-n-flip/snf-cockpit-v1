import type { Config } from 'payload'

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
        useAsTitle: `title`,
        group: `Network`,
      },
      fields: [],
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    },
  ]

  return collectionsWithBlockExplorers
}
