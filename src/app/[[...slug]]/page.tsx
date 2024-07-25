import { Pages } from '@/lib/payloadcms/types/payload-types'
import { settings } from '@/lib/payloadcms/services'
import { views } from '@/lib/payloadcms/services/'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const pages = await views.getPages()
  const slugs: { slug: string }[] = []

  if (pages && pages.length > 0) {
    for (const doc of pages) {
      if (doc.slug) {
        slugs.push({ slug: doc.slug })
      }
    }
  }

  return slugs
}

export async function Page({ params: { slug } }: PageProps) {
  if (!slug || slug === '') {
    const project = await settings.getProject()
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

  if (!page) {
    return notFound()
  }

  return (
    <div className="container">
      <h1>Page {JSON.stringify(page)}</h1>
    </div>
  )
}

export default Page
