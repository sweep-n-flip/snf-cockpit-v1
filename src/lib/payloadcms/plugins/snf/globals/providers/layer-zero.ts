import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type LayerZeroParams = {
  globals: Config['globals']
}

export const layerZero = ({ globals }: LayerZeroParams): LayerZeroParams['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `layer_zero`,
      label: 'Layer Zero',
      typescript: {
        interface: `LayerZero`,
      },
      graphQL: {
        name: `LayerZero`,
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
              type: 'number',
              name: 'abstractChainId',
              label: 'Abstract Chain ID',
              required: true,
              /// todo: filter options that is \not selected yet
            },
          ],
        },
      ],
    },
  ]
}
