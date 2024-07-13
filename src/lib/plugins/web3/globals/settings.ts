import type { Config } from 'payload'

export type Settings = Pick<Config, 'globals'>

export const settings = ({ globals }: Settings): Settings['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `config`,
      typescript: {
        interface: `Config`,
      },
      graphQL: {
        name: `Config`,
      },
      admin: {
        group: `Settings`,
      },
      access: {
        read: () => true,
      },
      fields: [
        {
          type: 'checkbox',
          name: 'testnet',
          label: 'Testnet Mode',
          admin: {
            description: `Enable testnet mode to use testnet contracts and tokens.`,
          },
        },
      ],
    },
  ]
}
