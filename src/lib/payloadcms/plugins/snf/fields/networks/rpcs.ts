import type { CollectionConfig } from 'payload'

export type RpcsParams = {
  fieldsAfter?: CollectionConfig['fields']
  fieldsBefore?: CollectionConfig['fields']
}

export const rpcs = (params?: RpcsParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [] } = params || {}
  return [
    ...fieldsBefore,
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
    ...fieldsAfter,
  ]
}
