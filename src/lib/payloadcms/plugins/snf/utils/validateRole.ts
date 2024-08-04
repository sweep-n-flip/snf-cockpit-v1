import type { AccessArgs } from 'payload'
import { checkRole } from './checkRole'

export const adminsAndUser = ({ id, req: { user } }: AccessArgs) => {
  if (user) {
    // Admin can access
    if (checkRole([`admin`], user)) {
      return true
    }

    // Only current user can access their self data
    if (id === user.id) {
      return true
    }
  }

  return false
}

export const adminsOrPublished = ({ req: { user } }: AccessArgs) => {
  if (user && checkRole([`admin`], user)) {
    return true
  }

  return {
    _status: {
      equals: `published`,
    },
  }
}

export const admins = ({ req: { user } }: AccessArgs) => {
  return checkRole([`admin`], user ? user : undefined)
}

export const anyone = () => true

export const noOne = () => false
