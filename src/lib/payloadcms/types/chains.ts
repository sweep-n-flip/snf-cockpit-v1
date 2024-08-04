import { Marketplaces, Contracts } from '@/lib/payloadcms/types/payload-types'

export type ChainCustom = {
  logo: string
  slug: string
  abis: Record<string, Contracts['abi']>
  marketplaces: Record<string, Marketplaces>
}
