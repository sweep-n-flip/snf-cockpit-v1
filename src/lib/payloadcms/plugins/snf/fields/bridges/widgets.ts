import type { CollectionConfig } from 'payload'
import { admins, anyone, noOne } from '../../utils/validateRole'
import { BridgeCategories } from '@/lib/payloadcms/types/payload-types'

export type WidgetParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
}

export const widgets = (params?: WidgetParams): CollectionConfig['fields'] => {
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
          type: 'relationship',
          name: 'category',
          label: 'Category',
          required: true,
          relationTo: 'bridgeCategories',
        },
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
          validate: async (value: number, { req, operation, siblingData }) => {
            /**
             * If we are creating a new bridge, we need to ensure the version is greater than the latest version
             */
            if (operation === 'create') {
              const category = siblingData?.category as BridgeCategories

              if (category === undefined) {
                return 'Category is required'
              }

              const latestVersion = await req.payload.find({
                collection: 'bridgeWidgets',
                limit: 1,
                sort: '-setup.version',
                where: {
                  'setup.category': {
                    equals: category,
                  },
                },
              })

              console.log('latestVersion', JSON.stringify(latestVersion))

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
