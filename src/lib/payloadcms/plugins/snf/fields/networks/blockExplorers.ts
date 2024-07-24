import type { CollectionConfig } from 'payload'
import { slug } from '../utils/slug'

export const blockExplorers = (): CollectionConfig['fields'] => {
  return [
    ...slug({
      fieldToFormat: 'name',
      index: false,
      unique: true,
    }),
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
  ]
}
