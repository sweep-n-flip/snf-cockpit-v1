import type { Config } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type Project = {
  globals: Config['globals']
}

export const evm = ({ globals }: Project): Project['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `evm`,
      typescript: {
        interface: `Evm`,
      },
      graphQL: {
        name: `Evm`,
      },
      admin: {
        group: `Providers`,
      },
      access: {
        read: anyone,
        update: admins,
      },
      fields: [
        {
          type: 'relationship',
          name: 'Chains',
          label: 'Chains',
          relationTo: 'chains',
          hasMany: true,
          required: true,
        },
      ],
    },
  ]
}
