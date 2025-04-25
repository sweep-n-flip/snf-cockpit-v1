import type { Config } from 'payload'
import { media } from './media'
import { networks } from './networks'
import { tokens } from './tokens'
import { users } from './users'

export type Globals = {
  collections: Config['collections']
}

export const collections = {
  users: users.override,
  ...networks,
  ...media,
  ...tokens,
}
