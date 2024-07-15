import type { CollectionConfig } from 'payload'

export const rpcs = (): CollectionConfig['fields'] => {
  return [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true,
    },
    {
      type: 'array',
      name: 'http',
      minRows: 1,
      required: true,
      label: 'RPC',
      labels: {
        singular: 'RPC',
        plural: 'RPCs',
      },
      fields: [
        {
          type: 'text',
          name: 'url',
          label: 'URL',
          required: true,
        },
      ],
    },
    {
      type: 'array',
      name: 'webSocket',
      minRows: 1,
      required: true,
      label: 'Web Socket',
      labels: {
        singular: 'WebSocket',
        plural: 'WebSockets',
      },
      fields: [
        {
          type: 'text',
          name: 'url',
          label: 'URL',
          required: true,
        },
      ],
    },
  ]
}
