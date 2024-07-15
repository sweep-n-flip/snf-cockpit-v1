import type { Config } from 'payload'
import { settings } from './settings'

export type Globals = {
  globals: Config['globals']
}

export const globals = {
  ...settings,
}
