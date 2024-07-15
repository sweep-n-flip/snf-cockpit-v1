import type { CollectionConfig } from 'payload'

export const contracts = (): CollectionConfig['fields'] => {
  return [
    {
      unique: true,
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'blockCreated',
      label: 'Block Created',
      type: 'number',
    },
  ]
}
