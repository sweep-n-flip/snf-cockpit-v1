import type { CollectionConfig } from 'payload'
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
        beforeChange: [
          async ({ req, operation, value }) => {
            if (operation === `create`) {
              /// dev: ensure first user is admin
              const users = await req.payload.find({ collection: `users`, limit: 0, depth: 0 })
              if (users.totalDocs === 0) {
                // if `admin` not in array of values, add it
                if (!(value || []).includes(`admin`)) {
                  return [...(value || []), `admin`]
                }
              }
            }

            return value
          },
        ],
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
