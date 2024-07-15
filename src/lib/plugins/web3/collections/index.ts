import type { Config } from 'payload'
import { networks } from './networks'

export type Globals = {
  collections: Config['collections']
}

export const collections = {
  ...networks,
}
