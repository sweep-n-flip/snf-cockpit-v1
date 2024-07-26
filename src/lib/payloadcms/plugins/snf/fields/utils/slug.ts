import type { CollectionConfig, TextField } from 'payload'

import { formatSlug } from '../../hooks/utils/beforeValidate/formatSlug'

export type SlugParams = {
  fieldsBefore?: CollectionConfig['fields']
  fieldsAfter?: CollectionConfig['fields']
  slugFieldProps: {
    fieldToFormat: string
    unique?: boolean
  } & Partial<TextField>
}

export const slug = (params?: SlugParams): CollectionConfig['fields'] => {
  const { fieldsBefore = [], fieldsAfter = [], slugFieldProps } = params || {}
  const { fieldToFormat = 'title', unique = true, ...fieldProps } = slugFieldProps || {}

  return [
    ...fieldsBefore,
    {
      ...(fieldProps as TextField),
      unique,
      name: `slug`,
      type: `text`,
      required: true,
      admin: {
        position: `sidebar`,
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToFormat)],
      },
    },
    ...fieldsAfter,
  ]
}
