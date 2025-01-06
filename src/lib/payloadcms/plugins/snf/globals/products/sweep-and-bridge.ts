import type { Config, RelationshipField } from 'payload'
import { admins, anyone } from '../../utils/validateRole'

export type Project = {
  globals: Config['globals']
}

export const sweepAndBridge = ({ globals }: Project): Project['globals'] => {
  return [
    ...(globals ? globals : []),
    {
      slug: `bridge`,
      typescript: {
        interface: `SweepAndBridge`,
      },
      graphQL: {
        name: `SweepAndBridge`,
      },
      admin: {
        group: `Products`,
      },
      access: {
        read: anyone,
        update: admins,
      },
      versions: {
        drafts: false,
      },
      fields: [
        {
          type: 'text',
          name: 'title',
          label: 'Title',
          required: true,
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
        },
        {
          type: 'group',
          label: 'Routing',
          name: 'routing',
          fields: [
            {
              type: 'array',
              name: 'paths',
              label: 'Paths',
              minRows: 1,
              required: true,
              access: {
                create: admins,
                update: admins,
                read: anyone,
              },
              /**
               * 1. Only allow target chains that are not the same as the source chain
               * 2. If a source contract is selected, only allow target contracts that are not the same as the source contract
               */
              fields: [
                {
                  type: 'relationship',
                  name: 'sourceChain',
                  label: 'Source Chain',
                  hasMany: false,
                  required: true,
                  relationTo: 'chains',
                } as RelationshipField,
                {
                  type: 'relationship',
                  name: 'sourceContract',
                  label: 'Source Contract',
                  relationTo: 'contracts',
                  hasMany: false,
                  required: true,
                  filterOptions({ relationTo, siblingData }: any) {
                    if (relationTo === 'contracts') {
                      return {
                        chain: {
                          equals: siblingData?.sourceChain,
                        },
                      }
                    }
                  },
                } as RelationshipField,
                {
                  type: 'relationship',
                  name: 'targetChain',
                  label: 'Target Chain',
                  hasMany: false,
                  required: true,
                  relationTo: 'chains',
                  validate: (value: string, { siblingData }: any) => {
                    if (value === siblingData?.sourceChain) {
                      return 'Target chain must be different from the source chain'
                    }

                    return true
                  },
                } as RelationshipField,
              ],
            },
          ],
        },
      ],
    },
  ]
}
