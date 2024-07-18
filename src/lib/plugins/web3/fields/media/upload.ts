import type { CollectionConfig } from 'payload'

export type UploadParams = {
  fields: CollectionConfig['fields']
}

export const upload = ({ fields }: UploadParams): UploadParams['fields'] => {
  /// todo: increment fields
  return [...fields]
}
