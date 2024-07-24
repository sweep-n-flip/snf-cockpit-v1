import type { CollectionConfig } from 'payload'
import { slug } from '../utils/slug'

export const contracts = (): CollectionConfig['fields'] => {
  return [
    ...slug({
      fieldToFormat: 'name',
      index: false,
      unique: true,
    }),
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
    {
      type: 'textarea',
      name: 'abi',
      label: 'ABI',
      required: true,
    },
  ]
}
