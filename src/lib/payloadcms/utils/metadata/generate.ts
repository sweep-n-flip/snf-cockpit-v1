import { Metadata } from 'next'
import { Pages } from '@/lib/payloadcms/types/payload-types'

export const metadataGenerate = ({
  page,
  isHomepage = false,
  siteName,
  siteUrl,
}: {
  page: Pages
  siteName: string
  siteUrl: string
  isHomepage?: boolean
}) => {
  const slug = page.slug && !isHomepage ? page.slug : ``
  const path = `${siteUrl}/${slug}`

  const metaTitle = `${page.title} - ${siteName}`
  const metaDescription = page.meta?.description || ``
  const metaImage = typeof page.meta?.image == `object` ? page.meta.image?.url : null

  // Init metadata
  const metadata: Metadata = {
    title: metaTitle,
    description: metaDescription,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: path,
    },
    icons: `${siteUrl}/favicon.ico`,
    metadataBase: path ? new URL(`${path}`) : null,
  }

  if (metaImage) {
    // Set metadata open graph facebook
    metadata.openGraph = {
      type: `website`,
      url: path,
      title: metaTitle,
      description: metaDescription,
      images: metaImage,
    }

    // Set metadata twitter
    metadata.twitter = {
      title: metaTitle,
      description: metaDescription,
      images: metaImage,
    }
  }

  return metadata
}
