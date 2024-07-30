import type { CollectionConfig } from 'payload'
import { zeroAddress } from 'viem'

export type ChainsParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
  customAfter?: CollectionConfig['fields']
  customBefore?: CollectionConfig['fields']
}

export const chains = (params?: ChainsParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [], customAfter = [], customBefore = [] } = params || {}

  return [
    ...fieldsBefore,
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
      type: 'group',
      name: 'custom',
      label: 'Custom',
      fields: [
        ...customBefore,
        {
          name: 'logo',
          label: 'Logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },

        ...customAfter,
      ],
    },

    ...fieldsAfter,
  ]
}
