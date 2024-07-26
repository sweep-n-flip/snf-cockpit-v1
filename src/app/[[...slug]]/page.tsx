import { Pages } from '@/lib/payloadcms/types/payload-types'
import { settings } from '@/lib/payloadcms/services'
import { views } from '@/lib/payloadcms/services/'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { metadataGenerate } from '@/lib/payloadcms/utils/metadata/generate'

interface PageProps {
  params: { slug: string }
}

const _getViewData = async (slug: string) => {
  const project = await settings.getProject()
  const isHomepage = !slug || slug === ''

  if (isHomepage) {
    const defaultView = project.views.defaultView as Pages

    if (defaultView) {
      slug = defaultView.slug
    }
  }

  const page = await views.getPage({
    where: {
      slug: {
        equals: slug,
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
  const { page, isHomepage, project } = await _getViewData(slug)

  if (!page) return {}

  return metadataGenerate({
    isHomepage,
    page,
    siteName: project.name,
    siteUrl: project.url,
  })
}

export default async function Page({ params: { slug } }: PageProps) {
  const { page } = await _getViewData(slug)

  if (!page) {
    return notFound()
  }

  return (
    <div className="container">
      <h1>Page {JSON.stringify(page)}</h1>
    </div>
  )
}
