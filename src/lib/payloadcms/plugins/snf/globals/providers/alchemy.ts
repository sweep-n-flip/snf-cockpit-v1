import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type AlchemyParams = {
  globals: Config['globals']
}

export const alchemy = ({ globals }: AlchemyParams): AlchemyParams['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `alchemy`,
      typescript: {
        interface: `Alchemy`,
      },
      graphQL: {
        name: `Alchemy`,
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
              admin: {
                description: 'Eg: MATIC_MAINNET',
              },
            },
          ],
        },
      ],
    },
  ]
}
