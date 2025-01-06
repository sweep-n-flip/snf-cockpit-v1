import type { Config } from 'payload'
import { providers } from './providers'
import { settings } from './settings'
import { products } from '@/lib/payloadcms/plugins/snf/globals/products'

export type Globals = {
  globals: Config['globals']
}

export const globals = {
  ...products,
  ...settings,
  ...providers,
}
