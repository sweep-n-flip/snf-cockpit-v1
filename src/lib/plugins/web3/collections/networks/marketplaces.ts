import type { Config } from 'payload'

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

  return collectionsWithMarketplaces
}
