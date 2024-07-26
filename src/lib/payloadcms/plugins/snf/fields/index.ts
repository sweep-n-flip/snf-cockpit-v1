import { networks } from './networks'
import { media } from './media'
import { tokens } from './tokens'
import { views } from './views'
import { users } from './users'
import { utils } from './utils'
import { layout } from './layout'

export const fields = {
  ...networks,
  ...media,
  ...tokens,
  ...views,
  ...utils,
  ...layout,
  users,
}
