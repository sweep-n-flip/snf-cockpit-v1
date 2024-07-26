import type { CollectionConfig } from 'payload'

export const blocks = (): CollectionConfig['fields'] => {
  return [
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
