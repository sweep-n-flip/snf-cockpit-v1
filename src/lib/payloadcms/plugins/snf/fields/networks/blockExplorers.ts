import type { CollectionConfig } from 'payload'

export type BlockExplorersParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
}

export const blockExplorers = (params?: BlockExplorersParams): CollectionConfig['fields'] => {
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
      name: 'url',
      label: 'URL',
      required: true,
    },
    {
      type: 'text',
      name: 'apiUrl',
      label: 'API URL',
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'chain',
      type: 'relationship',
      relationTo: 'chains',
      label: 'Chain',
      required: true,
    },
    ...fieldsAfter,
  ]
}
