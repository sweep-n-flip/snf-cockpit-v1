import type { Config } from 'payload'
import { fields } from '../../fields'

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
        useAsTitle: `title`,
        group: `Network`,
      },
      fields: fields.rpcs(),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    },
  ]

  return collectionsWithRpcs
}
