import type { Config } from 'payload'
import { networks } from './networks'
import { media } from './media'

export type Globals = {
  collections: Config['collections']
}

export const collections = {
  ...networks,
  ...media,
}
