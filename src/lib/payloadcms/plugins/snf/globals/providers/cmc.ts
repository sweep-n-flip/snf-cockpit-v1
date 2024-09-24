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
      label: 'Coin Market Cap',
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
                      hasMany: false,
                      required: true,
                      /// todo: filter options that is \not selected yet
                    },
                    {
                      type: 'text',
                      name: 'chainSlug',
                      label: 'Chain Slug',
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
            // todo:
            // {
            //   label: 'Endpoints',
            //   fields: [
            //     {
            //       type: 'array',
            //       name: 'endpoints',
            //       label: false,
            //       fields: [
            //         {
            //           type: 'select',
            //           name: 'type',
            //           label: 'Type',
            //           required: true,
            //           options: [
            //             {
            //               label: 'Quote',
            //               value: 'quote',
            //             },
            //           ],
            //         },
            //         {
            //           type: 'text',
            //           name: 'path',
            //           label: 'Path',
            //           required: true,
            //         },
            //         {
            //           type: 'text',
            //           name: 'slugPath',
            //           label: 'Slug Path',
            //           required: true,
            //           admin: {
            //             description: 'Eg: ?slug={{slug}}',
            //           },
            //         },
            //       ],
            //     },
            //   ],
            // },
          ],
        },
      ],
    },
  ]
}
