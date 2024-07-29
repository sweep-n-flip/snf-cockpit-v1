import type { CollectionConfig } from 'payload'
import { beforeChange } from '../../hooks/utils/beforeChange'
import { admins } from '../../utils/validateRole'

export type RolesParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
}

export const roles = (params?: RolesParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [] } = params || {}

  return [
    ...fieldsBefore,
    {
      name: `name`,
      type: `text`,
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
    ...fieldsAfter,
  ]
}
