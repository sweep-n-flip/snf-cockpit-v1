import type { Config } from 'payload'

export type Chains = {
  collections: Config['collections']
}

import { fields } from '../../fields'

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
      admin: {
        useAsTitle: `title`,
        group: `Network`,
      },
      fields: fields.chains(),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
    },
  ]

  return collectionsWithChain
}
