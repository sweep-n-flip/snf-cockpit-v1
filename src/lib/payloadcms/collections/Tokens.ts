import type { CollectionConfig } from 'payload'

export const Tokens: CollectionConfig = {
  slug: 'tokens',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'symbol', 'address', 'nativeChain'],
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
      name: 'decimals',
      type: 'number',
    },
    {
      name: 'logo',
      type: 'text',
    },
    {
      name: 'nativeChain',
      type: 'number', // Use number directly like backend-v3, not relationship
      required: true,
      index: true,
    },
    {
      name: 'isErc20',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isCollection',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'wrapper',
      type: 'group',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'symbol',
          type: 'text',
        },
        {
          name: 'isErc20',
          type: 'checkbox',
        },
        {
          name: 'isCollection',
          type: 'checkbox',
        },
        {
          name: 'address',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}