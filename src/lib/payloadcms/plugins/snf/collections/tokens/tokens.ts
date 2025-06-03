import type { Config, Field } from 'payload'

export type Tokens = {
  collections: Config['collections']
}

import { admins, anyone } from '../../utils/validateRole'

export const tokens = ({ collections }: Tokens): Tokens['collections'] => {
  const collectionsWithTokens = [
    ...(collections ? collections : []),
    {
      slug: `tokens`,
      labels: {
        singular: `Token`,
        plural: `Tokens`,
      },
      disableDuplicate: true,
      typescript: {
        interface: `Tokens`,
      },
      admin: {
        useAsTitle: `name`,
        defaultColumns: ['name', 'symbol', 'address', 'nativeChain'],
        group: `Tokens`,
      },
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
          index: true,
        } as Field,
        {
          name: 'name',
          type: 'text',
          required: true,
        } as Field,
        {
          name: 'symbol',
          type: 'text',
        } as Field,
        {
          name: 'decimals',
          type: 'number',
        } as Field,
        {
          name: 'logo',
          type: 'text',
        } as Field,
        {
          name: 'nativeChain',
          type: 'number',
          required: true,
          index: true,
        } as Field,
        {
          name: 'isErc20',
          type: 'checkbox',
          defaultValue: false,
        } as Field,
        {
          name: 'isCollection',
          type: 'checkbox',
          defaultValue: false,
        } as Field,
        {
          name: 'wrapper',
          type: 'group',
          fields: [
            {
              name: 'id',
              type: 'text',
            } as Field,
            {
              name: 'name',
              type: 'text',
            } as Field,
            {
              name: 'symbol',
              type: 'text',
            } as Field,
            {
              name: 'isErc20',
              type: 'checkbox',
            } as Field,
            {
              name: 'isCollection',
              type: 'checkbox',
            } as Field,
            {
              name: 'address',
              type: 'text',
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

  return collectionsWithTokens
}
