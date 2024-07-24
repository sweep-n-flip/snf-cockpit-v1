import type { CollectionConfig } from 'payload'
import { slug } from '../utils/slug'

export const collections = (): CollectionConfig['fields'] => {
  return [
    ...slug({
      fieldToFormat: 'name',
      index: false,
      unique: false,
    }),
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
  ]
}
