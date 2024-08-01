import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type MoralisParams = {
  globals: Config['globals']
}

export const moralis = ({ globals }: MoralisParams): MoralisParams['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `moralis`,
      typescript: {
        interface: `Moralis`,
      },
      graphQL: {
        name: `Moralis`,
      },
      admin: {
        group: `Providers`,
      },
      access: {
        read: anyone,
        update: admins,
      },
      fields: [
        {
          type: 'array',
          name: 'networks',
          label: 'Networks',
          fields: [
            {
              type: 'relationship',
              name: 'chain',
              label: 'Chain',
              relationTo: 'chains',
              required: true,
              /// todo: filter options that is \not selected yet
            },
            {
              type: 'text',
              name: 'apiKey',
              label: 'API Key',
              required: true,
            },
            {
              type: 'text',
              name: 'evmChainKey',
              label: 'EVM Chain Key',
              required: true,
            },
          ],
        },
      ],
    },
  ]
}
