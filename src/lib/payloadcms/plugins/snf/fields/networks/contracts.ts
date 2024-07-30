import type { CollectionConfig } from 'payload'

export type ContractsParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
}

export const contracts = (params?: ContractsParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [] } = params || {}
  return [
    ...fieldsBefore,

    {
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
    {
      name: 'chain',
      type: 'relationship',
      relationTo: 'chains',
      label: 'Chain',
      required: true,
    },
    ...fieldsAfter,
  ]
}
