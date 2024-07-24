import type { CollectionConfig } from 'payload'
import { slug } from '../utils/slug'

export const rpcs = (): CollectionConfig['fields'] => {
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
  ]
}
