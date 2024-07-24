import type { CollectionConfig } from 'payload'
import { beforeChange } from '../hooks/utils/beforeChange'
import { admins } from '../utils/validateRole'

export type Users = {
  fields: CollectionConfig['fields']
}

export const users = ({ fields }: Users): CollectionConfig['fields'] => {
  return [
    ...fields,
    {
      name: `name`,
      type: `text`,
    },
    {
      name: `email`,
      type: `email`,
    },
    {
      name: 'alias',
      type: 'text',
      label: 'Alias',
    },
    {
      name: `roles`,
      type: `select`,
      hasMany: true,
      defaultValue: [`user`],
      options: [
        {
          label: `admin`,
          value: `admin`,
        },
        {
          label: `user`,
          value: `user`,
        },
      ],
      hooks: {
        beforeChange: [beforeChange.ensureFirstUserIsAdmin()],
      },
      access: {
        read: admins,
        create: admins,
        update: admins,
      },
    },
  ]
}
