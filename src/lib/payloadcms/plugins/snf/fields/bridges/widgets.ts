import type {
  CollectionConfig,
  Field,
  RelationshipField,
  NumberField,
  ValidateOptions,
} from 'payload'
import { admins, anyone, noOne } from '../../utils/validateRole'
import { BridgeWidgets } from '@/lib/payloadcms/types/payload-types'

export type WidgetParams = {
  fieldsBefore?: Field[]
  fieldsAfter?: Field[]
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
      type: 'text',
      name: 'title',
      label: 'Title',
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
          relationTo: 'bridge_categories',
          access: {
            create: admins,
            update: noOne,
            read: anyone,
          },
        } as RelationshipField,
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
          async validate(
            value: number,
            {
              req,
              operation,
              siblingData,
            }: ValidateOptions<unknown, BridgeWidgets['setup'], {}, unknown>,
          ) {
            /**
             * If we are creating a new bridge, we need to ensure the version is greater than the latest version
             */
            if (operation === 'create') {
              const category = siblingData?.category

              if (category === undefined) {
                return 'Category is required'
              }

              const latestVersion = await req.payload.find({
                collection: 'bridge_widgets',
                limit: 1,
                sort: '-setup.version',
                where: {
                  'setup.category': {
                    equals: category,
                  },
                },
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
        } as NumberField,
      ],
    },
    {
      type: 'group',
      label: 'Routing',
      name: 'routing',
      fields: [
        {
          type: 'array',
          name: 'paths',
          label: 'Paths',
          minRows: 1,
          required: true,
          access: {
            create: admins,
            update: noOne,
            read: anyone,
          },
          /**
           * 1. Only allow target chains that are not the same as the source chain
           * 2. If a source contract is selected, only allow target contracts that are not the same as the source contract
           */
          fields: [
            {
              type: 'relationship',
              name: 'sourceChain',
              label: 'Source Chain',
              hasMany: false,
              required: true,
              relationTo: 'chains',
            } as RelationshipField,
            {
              type: 'relationship',
              name: 'sourceContract',
              label: 'Source Contract',
              relationTo: 'contracts',
              hasMany: false,
              required: true,
              filterOptions({ relationTo, siblingData }: any) {
                if (relationTo === 'contracts') {
                  return {
                    chain: {
                      equals: siblingData?.sourceChain,
                    },
                  }
                }
              },
            } as RelationshipField,
            {
              type: 'relationship',
              name: 'targetChain',
              label: 'Target Chain',
              hasMany: false,
              required: true,
              relationTo: 'chains',
              validate: (value: string, { siblingData }: any) => {
                if (value === siblingData?.sourceChain) {
                  return 'Target chain must be different from the source chain'
                }

                return true
              },
            } as RelationshipField,
          ],
        },
      ],
    },
    ...fieldsAfter,
  ]
}
