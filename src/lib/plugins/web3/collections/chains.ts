import { Payload } from 'payload'

export type Chains = Pick<Payload['config'], 'collections'>

import { fields } from '../fields'

import { ChainsContext } from '../fields/chains'

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
      fields: fields.chains({
        fields: [],
        context: ChainsContext.Config,
      }),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
        delete: () => true,
      },
    },
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
      fields: fields.chains({
        fields: [],
        context: ChainsContext.RPCS,
      }),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    },
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
        useAsTitle: `title`,
        group: `Network`,
      },
      fields: fields.chains({
        fields: [],
        context: ChainsContext.Contracts,
      }),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    },
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
      fields: fields.chains({
        fields: [],
        context: ChainsContext.Marketplaces,
      }),
      /// todo: change access
      access: {
        read: () => true,
        create: () => true,
        update: () => true,
      },
    },
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
      fields: fields.chains({
        fields: [],
        context: ChainsContext.BlockExplorers,
      }),
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
