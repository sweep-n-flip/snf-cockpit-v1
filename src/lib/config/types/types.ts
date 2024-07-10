import { Page, Social, Nav } from './enums'

export type PageConfig = {
  display?: boolean
  name: string
  description: string
  path: string
  children?: PagesConfig[]
}

export type PagesConfig = {
  [key in Page]: PageConfig
}

export type NavsConfig = {
  [key in Nav]: {
    [key in Page]: PageConfig
  }
}

export type MetaConfig = {
  description: string
  baseURL: string
}

export type NetworksConfig = {
  defaultChainId: number
}

export type SocialConfig = {
  [key in Social]: {
    url: string
    label: string
    hidden?: boolean
  }
}

export type BuilderConfig = {
  createdBy: string
  url: string
}
