import type { Block } from 'payload'

export type BridgeParams = {
  blocksAfter?: Block[]
  blocksBefore?: Block[]
}

export const bridge = (params?: BridgeParams): Block[] => {
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
          relationTo: 'bridges',
        },
      ],
    },
    ...blocksAfter,
  ]
}
