import type { CollectionConfig } from 'payload'

export const Chains: CollectionConfig = {
  slug: 'chains',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'chainId', 'isTestnet'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'chainId',
      type: 'number',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'text',
    },
    {
      name: 'isTestnet',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'rpcAddress',
      type: 'text',
    },
    {
      name: 'explorerUrl',
      type: 'text',
    },
    {
      name: 'network',
      type: 'json',
    },
    {
      name: 'stablecoinAddress',
      type: 'text',
    },
    {
      name: 'trendingItems',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
        },
      ],
    },
    {
      name: 'fractionalizerV1',
      type: 'json',
    },
    {
      name: 'fractionalizer',
      type: 'json',
    },
    {
      name: 'crowdpad',
      type: 'json',
    },
    {
      name: 'buyFloor',
      type: 'json',
    },
    {
      name: 'marketplace',
      type: 'json',
    },
    {
      name: 'box',
      type: 'json',
    },
    {
      name: 'exchange',
      type: 'json',
    },
    {
      name: 'rockpool',
      type: 'json',
    },
    {
      name: 'openseaConfig',
      type: 'json',
    },
    {
      name: 'hub',
      type: 'json',
    },
    {
      name: 'topCollectionsFirebaseKey',
      type: 'text',
    },
    {
      name: 'reservoir',
      type: 'json',
    },
    {
      name: 'alchemyApiUrl',
      type: 'text',
    },
    {
      name: 'selectedCollections',
      type: 'json',
    },
    {
      name: 'sweepAndFlip',
      type: 'json',
    },
  ],
  timestamps: true,
}