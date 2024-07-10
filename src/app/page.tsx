import { appConfig, Page as PageEnum, Nav } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${appConfig.name} - ${appConfig.navs[Nav.Main][PageEnum.Homepage].name}`,
  description: appConfig.meta.description,
}

export default function Page() {
  return <>Welcome</>
}
