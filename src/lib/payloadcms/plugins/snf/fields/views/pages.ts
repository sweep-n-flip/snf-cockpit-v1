import type { CollectionConfig } from 'payload'
import { slug } from '../utils/slug'

export const pages = (): CollectionConfig['fields'] => {
  return [
    ...slug({
      fieldToFormat: 'title',
      index: true,
      unique: true,
    }),
    {
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      type: 'textarea',
      name: 'excerpt',
      label: 'Excerpt',
      required: true,
    },
  ]
}
