import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

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
      access: {
        read: anyone,
        update: admins,
      },
      fields: [
        {
          type: 'checkbox',
          name: 'testnet',
          label: 'Testnet Mode',
          defaultValue: false,
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
          defaultValue: process.env.DEFAULT_APP_NAME,
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
          defaultValue: process.env.DEFAULT_APP_URL,
          required: true,
        },
        {
          type: 'group',
          name: 'views',
          fields: [
            {
              type: 'relationship',
              name: 'defaultView',
              label: 'Default View',
              relationTo: 'pages',
              required: true,
            },
          ],
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
