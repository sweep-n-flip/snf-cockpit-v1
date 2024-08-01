import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type ReservoirParams = {
  globals: Config['globals']
}

export const reservoir = ({ globals }: ReservoirParams): ReservoirParams['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `reservoir`,
      typescript: {
        interface: `Reservoir`,
      },
      graphQL: {
        name: `Reservoir`,
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
          type: 'tabs',
          tabs: [
            {
              label: 'Networks',
              fields: [
                {
                  type: 'array',
                  name: 'networks',
                  label: false,
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
                  ],
                },
              ],
            },
            {
              label: 'Endpoints',
              fields: [
                {
                  type: 'array',
                  name: 'endpoints',
                  label: false,
                  fields: [
                    {
                      type: 'select',
                      name: 'type',
                      label: 'Type',
                      required: true,
                      options: [
                        {
                          label: 'NFTS by account',
                          value: 'nfts_by_account',
                        },
                        {
                          label: 'NFTS by adddress',
                          value: 'nfts_by_address',
                        },
                      ],
                    },
                    {
                      type: 'text',
                      name: 'path',
                      label: 'Path',
                      required: true,
                    },
                    {
                      type: 'text',
                      name: 'slugPath',
                      label: 'Slug Path',
                      required: true,
                      admin: {
                        description: 'Eg: ?collection={{collectionAddress}}&excludeSpam=true',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
