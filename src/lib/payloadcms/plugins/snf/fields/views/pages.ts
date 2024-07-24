import type { CollectionConfig } from 'payload'
import { slug } from '../utils/slug'

export const pages = (): CollectionConfig['fields'] => {
  return [
    ...slug({
      fieldToFormat: 'name',
      index: true,
      unique: true,
    }),
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true,
    },
  ]
}
