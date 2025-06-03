import type { Config, Field } from 'payload'

export type Pools = {
  collections: Config['collections']
}

import { admins, anyone } from '../../utils/validateRole'

export const pools = ({ collections }: Pools): Pools['collections'] => {
  const collectionsWithPools = [
    ...(collections ? collections : []),
    {
      slug: `pools`,
      labels: {
        singular: `Pool`,
        plural: `Pools`,
      },
      disableDuplicate: true,
      typescript: {
        interface: `Pools`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name', 'chainId', 'poolStats'],
        group: `Tokens`,
      },
      fields: [
        {
          name: 'poolId',
          type: 'text',
          required: true,
          index: true,
        } as Field,
        {
          name: 'chainId',
          type: 'number',
          required: true,
          index: true,
        } as Field,
        {
          name: 'name',
          type: 'text',
          required: true,
        } as Field,
        {
          name: 'poolType',
          type: 'text',
        } as Field,
        {
          name: 'poolStats',
          type: 'group',
          fields: [
            {
              name: 'nftPrice',
              type: 'number',
            } as Field,
            {
              name: 'nftListings',
              type: 'text',
            } as Field,
            {
              name: 'offers',
              type: 'number',
            } as Field,
            {
              name: 'apr',
              type: 'number',
            } as Field,
            {
              name: 'tvl',
              type: 'number',
            } as Field,
            {
              name: 'delta',
              type: 'number',
            } as Field,
            {
              name: 'spotPrice',
              type: 'number',
            } as Field,
          ],
        } as Field,
      ],
      timestamps: true,
      access: {
        read: anyone,
        create: admins,
        update: admins,
        delete: admins,
      },
    },
  ]

  return collectionsWithPools
}
