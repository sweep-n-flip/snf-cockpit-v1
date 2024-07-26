import type { CollectionConfig } from 'payload'

export type PagesParams = {
  fieldsAfter?: CollectionConfig['fields']
  fieldsBefore?: CollectionConfig['fields']
}

export const pages = (params?: PagesParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [] } = params || {}

  return [
    ...fieldsBefore,
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      type: 'text',
      name: 'excerpt',
      label: 'Excerpt',
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...fieldsAfter,
  ]
}
