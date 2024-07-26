import type { Config } from 'payload'
import { networks } from './networks'
import { media } from './media'
import { tokens } from './tokens'
import { views } from './views'
import { users } from './users'
import { widgets } from './widgets'

export type Globals = {
  collections: Config['collections']
}

export const collections = {
  users: users.override,
  ...networks,
  ...media,
  ...tokens,
  ...views,
  ...widgets,
}
