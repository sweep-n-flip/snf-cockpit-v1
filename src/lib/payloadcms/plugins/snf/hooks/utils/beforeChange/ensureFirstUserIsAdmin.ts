import { User } from '@/lib/payloadcms/types/payload-types'
import { FieldHook } from 'payload'

export const ensureFirstUserIsAdmin =
  (): FieldHook<User> =>
  async ({ req, operation, value }) => {
    if (operation === `create`) {
      const users = await req.payload.find({ collection: `users`, limit: 0, depth: 0 })
      if (users.totalDocs === 0) {
        // if `admin` not in array of values, add it
        if (!(value || []).includes(`admin`)) {
          return [...(value || []), `admin`]
        }
      }
    }

    return value
  }
