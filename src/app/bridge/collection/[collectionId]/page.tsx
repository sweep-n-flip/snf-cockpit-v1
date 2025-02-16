import { products, settings } from '@/lib/services/local'
import { Metadata } from 'next'
import { metadataGenerate } from '@/lib/payloadcms/utils/metadata/generate'
import BridgeCollectionDetail from '@/components/bridge-collection/BridgeCollectionDetail'

export async function generateMetadata(): Promise<Metadata> {
  const project = await settings.getProject()
  const bridge = await products.getBridge()

  return metadataGenerate({
    isHomepage: true,
    page: {
      title: bridge.title,
      meta: {
        description: bridge.description,
        image: {
          url: project.logo.toString(),
        },
      },
    },
    siteName: project.name,
    siteUrl: project.url,
  })
}

export default async function Page() {
  const config = await products.getBridge()

  return <BridgeCollectionDetail config={config} />
}
