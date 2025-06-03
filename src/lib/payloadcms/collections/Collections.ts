import type { CollectionConfig } from 'payload'

export const Collections: CollectionConfig = {
  slug: 'collections',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'address', 'nativeChain', 'verified'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'address',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'symbol',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'text',
    },
    {
      name: 'banner',
      type: 'text',
    },
    {
      name: 'nativeChain',
      type: 'number', // Use number directly like backend-v3, not relationship
      required: true,
      index: true,
    },
    {
      name: 'availableChains',
      type: 'array',
      fields: [
        {
          name: 'chainId',
          type: 'number',
        },
      ],
    },
    {
      name: 'totalSupply',
      type: 'number',
    },
    {
      name: 'numNfts',
      type: 'number',
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'tokenType',
      type: 'text',
    },
    {
      name: 'floorPrice',
      type: 'number',
    },
    {
      name: 'holders',
      type: 'number',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'hasFees',
      type: 'checkbox',
    },
    {
      name: 'fee',
      type: 'number',
    },
    {
      name: 'feeAddress',
      type: 'text',
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}