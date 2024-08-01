import type { Config } from 'payload'
import { providers } from './providers'
import { settings } from './settings'

export type Globals = {
  globals: Config['globals']
}

export const globals = {
  project: settings.project,
  evm: providers.evm,
  layer_zero: providers.layerZero,
}
