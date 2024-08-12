import { Pages } from '@/lib/payloadcms/types/payload-types'
import { settings } from '@/lib/services/local'
import { views } from '@/lib/services/local'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { metadataGenerate } from '@/lib/payloadcms/utils/metadata/generate'
import { Block } from '@/lib/ui/components/blocks'

export type PageProps = {
  params: {
    slug?: string | string[] | undefined
  }
}

const getPageData = async (slug?: PageProps['params']['slug']) => {
  const project = await settings.getProject()
  const isHomepage = !slug?.length

  if (isHomepage) {
    const defaultView = project.views.defaultView as Pages

    if (defaultView) {
      slug = defaultView.slug
    }
  }

  const page = await views.getPage({
    where: {
      slug: {
        equals: Array.isArray(slug) ? slug[0] : slug,
      },
    },
  })

  if (!page) return { isHomepage, project, page: null }

  return { page, isHomepage, project }
}

export async function generateStaticParams() {
  const pages = await views.getPages()
  return pages.filter((page) => page.slug).map((page) => page.slug)
}

export async function generateMetadata({ params: { slug } }: PageProps): Promise<Metadata> {
  const { page, isHomepage, project } = await getPageData(slug)

  if (!page) return {}

  return metadataGenerate({
    isHomepage,
    page,
    siteName: project.name,
    siteUrl: project.url,
  })
}

export default async function Page({ params: { slug } }: PageProps) {
  const { page } = await getPageData(slug)

  if (!page) {
    return notFound()
  }

  return <Block layout={page.layout} />
}
