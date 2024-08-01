import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type CmcParams = {
  globals: Config['globals']
}

export const cmc = ({ globals }: CmcParams): CmcParams['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `cmc`,
      label: 'CoinMarketCap',
      typescript: {
        interface: `Cmc`,
      },
      graphQL: {
        name: `Cmc`,
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
              name: 'chainSlug',
              label: 'chainSlug',
              required: true,
              /// todo: filter options that is \not selected yet
            },
            {
              type: 'text',
              name: 'apikey',
              label: 'API Key',
              required: true,
            },
            {
              type: 'text',
              name: 'apiUrl',
              label: 'API URL',
              required: true,
            },
          ],
        },
      ],
    },
  ]
}
