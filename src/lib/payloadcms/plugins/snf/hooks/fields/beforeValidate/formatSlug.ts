import { FieldHook } from 'payload'
import { formatToSlug } from '../../../utils/format'

export const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === `string` && value.length > 0) {
      return formatToSlug(value)
    }

    if (!operation || ![`create`, 'update'].includes(operation)) return

    const fallbackData = data?.[fallback] || originalDoc?.[fallback]
    if (fallbackData && typeof fallbackData === `string`) {
      return formatToSlug(fallbackData)
    }

    return value
  }

export default formatSlug
