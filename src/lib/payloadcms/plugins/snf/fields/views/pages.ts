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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                {
                  slug: 'widget',
                  fields: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
