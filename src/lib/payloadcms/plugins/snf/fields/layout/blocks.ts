import type { Block, CollectionConfig } from 'payload'

export type BlocksParams = {
  fieldsAfter?: CollectionConfig['fields']
  fieldsBefore?: CollectionConfig['fields']
  blocksAfter?: Block[]
  blocksBefore?: Block[]
}

export const blocks = (params?: BlocksParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [], blocksAfter = [], blocksBefore = [] } = params || {}

  return [
    ...fieldsBefore,
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
                ...blocksBefore,
                {
                  slug: 'bridges',
                  labels: {
                    singular: 'Bridge',
                    plural: 'Bridges',
                  },
                  fields: [
                    {
                      type: 'relationship',
                      name: 'widget',
                      label: 'Widget',
                      relationTo: 'bridges',
                    },
                  ],
                },
                ...blocksAfter,
              ],
            },
          ],
        },
      ],
    },
    ...fieldsAfter,
  ]
}
