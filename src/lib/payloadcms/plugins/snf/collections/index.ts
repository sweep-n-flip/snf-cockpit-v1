import type { Config } from 'payload'
import { networks } from './networks'
import { media } from './media'
import { tokens } from './tokens'
import { views } from './views'
import { users } from './users'

export type Globals = {
  collections: Config['collections']
}

export const collections = {
  ...networks,
  ...media,
  ...tokens,
  ...views,
  users,
}
