import type { Block } from 'payload'

export type WidgetParams = {
  blocksAfter?: Block[]
  blocksBefore?: Block[]
}

export const widgets = (params?: WidgetParams): Block[] => {
  const { blocksBefore = [], blocksAfter = [] } = params || {}

  return [
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
          relationTo: 'bridgeWidgets',
        },
      ],
    },
    ...blocksAfter,
  ]
}
