import type { CollectionConfig } from 'payload'
import { admins, anyone, noOne } from '../../utils/validateRole'

export type WidgetParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
}

export const bridge = (params?: WidgetParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [] } = params || {}

  return [
    ...fieldsBefore,
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true,
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
    },
    {
      type: 'group',
      label: 'Setup',
      name: 'setup',
      fields: [
        {
          type: 'number',
          name: 'version',
          label: 'Version',
          required: true,
          access: {
            create: admins,
            update: noOne,
            read: anyone,
          },
          validate: async (value: number, { req, operation }) => {
            if (operation === 'create') {
              const latestVersion = await req.payload.find({
                collection: 'bridges',
                limit: 1,
                sort: '-version',
              })

              if (latestVersion.totalDocs === 0) {
                if (value !== 1) {
                  return 'Version must be 1'
                }

                return true
              }

              const latestVersionNumber = latestVersion.docs[0]?.setup.version || 0

              if (value <= latestVersionNumber) {
                return 'Version must be greater than the latest version'
              }

              return true
            }

            return true
          },
        },
      ],
    },
    ...fieldsAfter,
  ]
}
