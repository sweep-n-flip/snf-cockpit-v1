import { Marketplaces } from '@/lib/payloadcms/types/payload-types'

export type ChainCustom = {
  logo: string
  slug: string
  abis: Record<string, string>[]
  marketplaces: Record<string, Marketplaces>
}
