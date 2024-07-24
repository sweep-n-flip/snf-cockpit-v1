import type { CollectionConfig, TextField } from 'payload'

import { formatSlug } from '../../hooks/utils/beforeValidate/formatSlug'

export type SlugParams = Partial<TextField> & {
  fieldToFormat: string
  unique?: boolean
}

export const slug = ({
  fieldToFormat,
  unique = true,
  ...fieldProps
}: SlugParams): CollectionConfig['fields'] => {
  return [
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
  ]
}
