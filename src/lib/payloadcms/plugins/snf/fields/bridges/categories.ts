import type { CollectionConfig } from 'payload'

export type WidgetParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
}

export const categories = (params?: WidgetParams): CollectionConfig['fields'] => {
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
    ...fieldsAfter,
  ]
}
