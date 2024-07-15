import { Payload } from 'payload'

export type Chains = Pick<Payload['config'], 'collections'>

export const chains = ({ collections }: Chains): Chains['collections'] => {
  const collectionsWithchain = [
    ...(collections ? collections : []),
    {
      slug: `chain`,
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
      fields: [],
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    },
  ]

  return collectionsWithchain
}
