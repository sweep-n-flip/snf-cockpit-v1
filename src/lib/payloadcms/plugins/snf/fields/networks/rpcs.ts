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
      label: 'HTTP',
      labels: {
        singular: 'HTTP',
        plural: 'HTTPs',
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
    {
      type: 'text',
      name: 'slug',
      label: 'Slug',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ]
}
