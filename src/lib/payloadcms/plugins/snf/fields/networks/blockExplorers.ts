import type { CollectionConfig } from 'payload'

export const blockExplorers = (): CollectionConfig['fields'] => {
  return [
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
      type: 'text',
      name: 'slug',
      label: 'Slug',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ]
}
