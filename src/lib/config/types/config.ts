import { MetaConfig, NetworksConfig, SocialConfig, BuilderConfig, NavsConfig } from './types'

export type AppConfig = {
  name: string
  meta: MetaConfig
  navs: NavsConfig
  networks: NetworksConfig
  social: SocialConfig
  builder: BuilderConfig
}
