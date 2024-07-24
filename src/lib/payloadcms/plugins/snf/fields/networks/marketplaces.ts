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
      required: true,
      admin: {
        description:
          'Eg: /{{address}}/{{tokenId}} to replace {{address}} with the collection address and {{tokenId}} with the token id',
      },
    },
    {
      type: 'text',
      name: 'urlTokenPath',
      label: 'URL Token Path',
      required: true,
      admin: {
        description: 'Eg: /{{address}} to replace {{address}} with the collection address',
      },
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
