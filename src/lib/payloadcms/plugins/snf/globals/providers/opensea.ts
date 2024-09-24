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
                    {
                      type: 'text',
                      name: 'chainSlug',
                      label: 'Chain Slug',
                      required: true,
                    },
                  ],
                },
              ],
            },
            /// todo:
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
            //               label: 'NFTS by account',
            //               value: 'nfts_by_account',
            //             },
            //             {
            //               label: 'NFTS by collection slug',
            //               value: 'nfts_by_collection_slug',
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
            //             description: 'Eg: /{{chain}}/account/{{address}}/nfts',
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
