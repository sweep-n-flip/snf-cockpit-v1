/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { Metadata } from 'next'

import config from '@payload-config'
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  // @ts-ignore - Payload type compatibility issue with Next.js 15
  generatePageMetadata({ config, params: await params, searchParams: await searchParams })

// @ts-ignore - Payload type compatibility issue with Next.js 15
const Page = ({ params, searchParams }: Args) => RootPage({ config, params, searchParams })

export default Page
