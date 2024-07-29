import type { Config } from 'payload'
import { networks } from './networks'
import { media } from './media'
import { tokens } from './tokens'
import { views } from './views'
import { users } from './users'
import { bridges } from './bridges'

export type Globals = {
  collections: Config['collections']
}

export const collections = {
  users: users.override,
  bridge_widgets: bridges.widgets,
  bridge_categories: bridges.categories,
  ...networks,
  ...media,
  ...tokens,
  ...views,
}
