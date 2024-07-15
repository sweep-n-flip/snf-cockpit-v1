import type { CollectionConfig } from 'payload'

export const marketplaces = (): CollectionConfig['fields'] => {
  return [
    {
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true,
    },
    {
      type: 'text',
      name: 'url',
      label: 'URL',
      required: true,
    },
    {
      type: 'text',
      name: 'urlTokenIdPath',
      label: 'URL Token Id Path',
      admin: {
        description:
          'Eg: /{{address}}/{{tokenId}} to replace {{address}} with the collection address and {{tokenId}} with the token id',
      },
    },
  ]
}
