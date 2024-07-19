import type { CollectionConfig } from 'payload'

export const collections = (): CollectionConfig['fields'] => {
  return [
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
    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
  ]
}
