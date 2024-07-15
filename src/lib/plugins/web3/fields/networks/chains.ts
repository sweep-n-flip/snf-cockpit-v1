import type { CollectionConfig } from 'payload'
import { zeroAddress } from 'viem'

export const chains = (): CollectionConfig['fields'] => {
  return [
    {
      unique: true,
      name: 'chainId',
      label: 'Chain ID',
      type: 'number',

      required: true,
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'testnet',
      label: 'Testnet',
      type: 'checkbox',
    },
    {
      name: 'nativeCurrency',
      type: 'group',
      fields: [
        {
          type: 'text',
          name: 'name',
          label: 'Name',
          required: true,
        },
        {
          type: 'text',
          name: 'symbol',
          label: 'Symbol',
          required: true,
        },
        {
          type: 'number',
          name: 'decimals',
          label: 'Decimals',
          required: true,
        },
        {
          type: 'text',
          name: 'address',
          label: 'Address',
          defaultValue: zeroAddress,
          required: true,
        },
      ],
    },
    {
      name: 'rpcs',
      label: 'RPCs',
      type: 'relationship',
      relationTo: 'rpcs',
      hasMany: true,
      required: true,
    },
    {
      name: 'marketplaces',
      label: 'Marketplaces',
      type: 'relationship',
      relationTo: 'marketplaces',
      hasMany: true,
    },
    {
      name: 'contracts',
      label: 'Contracts',
      type: 'relationship',
      relationTo: 'contracts',
      hasMany: true,
    },
    {
      name: 'blockExplorers',
      label: 'Block Explorers',
      type: 'relationship',
      relationTo: 'blockExplorers',
      hasMany: true,
    },
  ]
}
