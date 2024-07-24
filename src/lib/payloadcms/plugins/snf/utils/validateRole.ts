import type { AccessArgs, Access, FieldAccess } from 'payload'
import { checkRole } from './checkRole'

export const adminsAndUser = ({ id, req: { user } }: AccessArgs) => {
  if (user) {
    // Admin can access
    if (checkRole([`admin`], user)) {
      return true
    }

    // Only current user can access theirself data
    if (id === user.id) {
      return true
    }
  }

  return false
}

export const adminsOrPublished: Access = ({ req: { user } }) => {
  if (user && checkRole([`admin`], user)) {
    return true
  }

  return {
    _status: {
      equals: `published`,
    },
  }
}

export const admins: FieldAccess = ({ req: { user } }) => {
  return checkRole([`admin`], user ? user : undefined)
}

export const anyone: Access = () => true
