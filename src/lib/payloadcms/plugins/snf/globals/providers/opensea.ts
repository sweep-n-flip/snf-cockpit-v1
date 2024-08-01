import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type OpenseaParams = {
  globals: Config['globals']
}

export const opensea = ({ globals }: OpenseaParams): OpenseaParams['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `opensea`,
      typescript: {
        interface: `Opensea`,
      },
      graphQL: {
        name: `Opensea`,
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
              name: 'apiUrl',
              label: 'API URL',
              required: true,
            },
            {
              type: 'text',
              name: 'slug',
              label: 'Slug',
              required: true,
            },
          ],
        },
      ],
    },
  ]
}
