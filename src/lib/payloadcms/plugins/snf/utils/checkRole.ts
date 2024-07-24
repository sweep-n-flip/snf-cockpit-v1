import { User } from '@/lib/payloadcms/types/payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: User): boolean => {
  if (allRoles?.length && user) {
    if (
      allRoles.some((role) => {
        return user?.roles?.some((individualRole) => {
          return individualRole === role
        })
      })
    )
      return true
  }

  return false
}
