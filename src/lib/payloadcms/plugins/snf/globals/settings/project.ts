import type { Config } from 'payload'

export type Project = {
  globals: Config['globals']
}

export const project = ({ globals }: Project): Project['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `project`,
      typescript: {
        interface: `Project`,
      },
      graphQL: {
        name: `Project`,
      },
      admin: {
        group: `Settings`,
      },
      /// todo: change access
      access: {
        read: () => true,
        update: () => true,
      },
      fields: [
        {
          type: 'checkbox',
          name: 'testnet',
          label: 'Testnet Mode',
          admin: {
            position: 'sidebar',
            description: `Enable testnet mode for the current environment`,
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
          name: 'name',
          label: 'App Name',
          required: true,
        },
        {
          type: 'text',
          name: 'description',
          label: 'App Description',
          required: true,
        },
        {
          type: 'text',
          name: 'url',
          label: 'App URL',
          required: true,
        },
        {
          type: 'group',
          name: 'networks',
          fields: [
            {
              type: 'relationship',
              name: 'defaultChain',
              label: 'Default Chain',
              relationTo: 'chains',
              required: true,
            },
          ],
        },
        {
          type: 'group',
          name: 'footer',
          fields: [
            {
              type: 'text',
              name: 'copyright',
              label: 'Copyright',
              required: true,
            },
          ],
        },
      ],
    },
  ]
}
