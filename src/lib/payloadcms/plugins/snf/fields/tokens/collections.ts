import type { CollectionConfig } from 'payload'

export type CollectionsParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
}

export const collections = (params?: CollectionsParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [] } = params || {}

  return [
    ...fieldsBefore,

    {
      type: 'text',
      name: 'address',
      label: 'Address',
      required: true,
    },
    {
      type: 'relationship',
      name: 'chain',
      label: 'Chain',
      relationTo: 'chains',
      required: true,
    },
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true,
    },
    {
      type: 'text',
      name: 'symbol',
      label: 'Symbol',
      required: true,
    },
    {
      type: 'richText',
      name: 'description',
      label: 'Description',
    },
    ...fieldsAfter,
  ]
}
