import type { CollectionConfig } from 'payload'

export const Pools: CollectionConfig = {
  slug: 'pools',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'chainId', 'poolStats'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'poolId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'chainId',
      type: 'number', // Use number directly like backend-v3, not relationship
      required: true,
      index: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'poolStats',
      type: 'group',
      fields: [
        {
          name: 'nftPrice',
          type: 'number',
        },
        {
          name: 'nftListings',
          type: 'text', // Can be string or number in backend
        },
        {
          name: 'offers',
          type: 'number',
        },
        {
          name: 'apr',
          type: 'number',
        },
        {
          name: 'totalVolume',
          type: 'number',
        },
        {
          name: 'liquidity',
          type: 'number',
        },
        {
          name: 'reserve0',
          type: 'number',
        },
        {
          name: 'reserve1',
          type: 'number',
        },
        {
          name: 'dailyVolume0',
          type: 'number',
        },
        {
          name: 'dailyVolume1',
          type: 'number',
        },
        {
          name: 'updatedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'token0',
      type: 'group',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'symbol',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'isErc20',
          type: 'checkbox',
        },
        {
          name: 'isCollection',
          type: 'checkbox',
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'wrapper',
          type: 'group',
          fields: [
            {
              name: 'id',
              type: 'text',
            },
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'symbol',
              type: 'text',
            },
            {
              name: 'isErc20',
              type: 'checkbox',
            },
            {
              name: 'isCollection',
              type: 'checkbox',
            },
            {
              name: 'address',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'token1',
      type: 'group',
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'symbol',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'isErc20',
          type: 'checkbox',
        },
        {
          name: 'isCollection',
          type: 'checkbox',
        },
        {
          name: 'address',
          type: 'text',
        },
        {
          name: 'wrapper',
          type: 'group',
          fields: [
            {
              name: 'id',
              type: 'text',
            },
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'symbol',
              type: 'text',
            },
            {
              name: 'isErc20',
              type: 'checkbox',
            },
            {
              name: 'isCollection',
              type: 'checkbox',
            },
            {
              name: 'address',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'chain',
      type: 'group',
      fields: [
        {
          name: 'id',
          type: 'number',
        },
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'networkType',
          type: 'text',
        },
        {
          name: 'rpcUrl',
          type: 'text',
        },
        {
          name: 'explorerUrl',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}