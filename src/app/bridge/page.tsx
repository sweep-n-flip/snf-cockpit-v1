import { appConfig, Page as PageEnum, Nav } from '@/lib/config'
import type { Metadata } from 'next'

import { Page } from '@/lib/bridge/views'

export const metadata: Metadata = {
  title: `${appConfig.name} - ${appConfig.navs[Nav.Main][PageEnum.Bridge].name}`,
  description: appConfig.meta.description,
}

export default Page
