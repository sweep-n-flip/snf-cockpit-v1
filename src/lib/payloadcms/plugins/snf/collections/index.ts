import type { Config } from 'payload'
import { networks } from './networks'
import { media } from './media'
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
