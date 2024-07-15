import { Payload } from 'payload'

export type Settings = Pick<Payload['config'], 'globals'>

export const settings = ({ globals }: Settings): Settings['globals'] => {
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
            description: `Enable testnet mode to use testnet contracts and tokens.`,
          },
        },
        {
          type: 'text',
          name: 'appName',
          label: 'App Name',
          required: true,
        },
      ],
    },
  ]
}
