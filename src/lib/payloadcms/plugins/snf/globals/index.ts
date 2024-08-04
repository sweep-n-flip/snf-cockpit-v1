import type { Config } from 'payload'
import { providers } from './providers'
import { settings } from './settings'

export type Globals = {
  globals: Config['globals']
}

export const globals = {
  ...settings,
  ...providers,
}
