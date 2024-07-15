import type { Config } from 'payload'

export type Chains = {
  collections: Config['collections']
}

import { fields } from '../../fields'

export const chains = ({ collections }: Chains): Chains['collections'] => {
  const collectionsWithchain = [
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
      admin: {
        useAsTitle: `title`,
        group: `Network`,
      },
      fields: fields.networks.chains(),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
    },
    // {
    //   slug: `blockExplorers`,
    //   labels: {
    //     singular: `Block Explorer`,
    //     plural: `Block Explorers`,
    //   },
    //   typescript: {
    //     interface: `BlockExplorers`,
    //   },
    //   admin: {
    //     useAsTitle: `title`,
    //     group: `Network`,
    //   },
    //   fields: fields.chains({
    //     fields: [],
    //     context: ChainsContext.BlockExplorers,
    //   }),
    //   /// todo: change access
    //   access: {
    //     read: () => true,
    //     create: () => true,
    //     update: () => true,
    //   },
    // },
  ]

  return collectionsWithchain
}
